import type { CallLog, TranscriptLine } from '../../../src/types';
import { config } from '../config';
import { db, samePhone } from '../db';
import { getTelentir, isTelentirEnabled } from './client';
import { pendingReminders } from './reminders';

let lastSyncedAt: string | undefined;

const iso = (d: string | Date | undefined) => (d ? new Date(d).toISOString() : undefined);

/**
 * Telentir doesn't document the transcription object's format, so accept the
 * shapes it is likely to take: a plain string ("Agent: …\nUser: …") or an
 * array of turns with a role/speaker and text/content field.
 */
const normalizeTranscript = (raw: unknown): TranscriptLine[] => {
  const speakerOf = (role: unknown): TranscriptLine['speaker'] =>
    /agent|assistant|ai|bot/i.test(String(role ?? '')) ? 'agent' : 'caller';

  if (typeof raw === 'string') {
    return raw
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => {
        const [, who, text] = line.match(/^([^:]{1,20}):\s*(.*)$/) ?? [];
        return who ? { speaker: speakerOf(who), text } : { speaker: 'agent' as const, text: line };
      });
  }

  const turns = Array.isArray(raw)
    ? raw
    : raw && typeof raw === 'object'
      ? ((raw as Record<string, unknown>).messages ?? (raw as Record<string, unknown>).transcript)
      : undefined;
  if (!Array.isArray(turns)) return [];

  return turns
    .map((t): TranscriptLine | undefined => {
      const turn = (t ?? {}) as Record<string, unknown>;
      const text = turn.text ?? turn.content ?? turn.message;
      return typeof text === 'string'
        ? {
            speaker: speakerOf(turn.role ?? turn.speaker ?? turn.from),
            text,
            at: iso((turn.timestamp ?? turn.time ?? turn.at) as string | undefined),
          }
        : undefined;
    })
    .filter((t): t is TranscriptLine => Boolean(t));
};

/** Links an outbound call to the appointment we placed a reminder for. */
const matchReminder = (phone: string, startedAt: string) => {
  const started = new Date(startedAt).getTime();
  return pendingReminders.find(
    (r) => samePhone(r.phone, phone) && started >= r.placedAt - 60_000 && started <= r.placedAt + 15 * 60_000
  )?.appointmentId;
};

export const syncCalls = async (): Promise<CallLog[]> => {
  const telentir = await getTelentir();
  const calls = await telentir.calls.all();

  const logs = await Promise.all(
    calls.map(async (call): Promise<CallLog> => {
      const startedAt = iso(call.startDate)!;
      const endedAt = iso(call.endDate);
      const talkStart = iso(call.conversationStartDate) ?? startedAt;
      const existing = db.callLogs.find((c) => c.externalCallId === call.id);

      // Transcripts are encrypted objects; fetch each once and keep it.
      let transcript = existing?.transcript ?? [];
      if (transcript.length === 0 && call.relations?.transcription && call.status !== 'ongoing') {
        try {
          transcript = normalizeTranscript(await telentir.objects.decryptObject(call.relations.transcription));
        } catch (err) {
          console.warn(`[telentir] could not load transcript for call ${call.id}:`, (err as Error).message);
        }
      }

      return {
        id: `tl-${call.id}`,
        provider: 'telentir',
        externalCallId: call.id,
        direction: call.direction,
        contactName: call.contact?.name,
        contactPhone: call.contact?.phone ?? '',
        clinicNumber: call.phone?.number ?? '',
        startedAt,
        endedAt,
        durationSec: endedAt
          ? Math.max(0, Math.round((new Date(endedAt).getTime() - new Date(talkStart).getTime()) / 1000))
          : 0,
        status: call.status,
        summary: call.notes ?? '',
        transcript,
        appointmentId:
          existing?.appointmentId ??
          (call.direction === 'outbound' ? matchReminder(call.contact?.phone ?? '', startedAt) : undefined),
      };
    })
  );

  logs.sort((a, b) => b.startedAt.localeCompare(a.startedAt));
  // Real data replaces the seeded demo calls.
  db.callLogs = logs;
  lastSyncedAt = new Date().toISOString();
  return logs;
};

export const getCallLogs = () => db.callLogs;

export const startCallSync = () => {
  const seconds = config.telentir.syncIntervalSec;
  if (!isTelentirEnabled() || seconds <= 0) return;

  const run = () =>
    syncCalls()
      .then((logs) => console.log(`[telentir] synced ${logs.length} calls at ${lastSyncedAt}`))
      .catch((err) => console.warn('[telentir] call sync failed:', (err as Error).message));

  void run();
  setInterval(run, seconds * 1000).unref();
};

import type { ID } from './common.types';

export type CallDirection = 'inbound' | 'outbound';

/** Mirrors Telentir's call statuses. */
export type CallStatus = 'completed' | 'missed' | 'voicemail' | 'callback' | 'ongoing';

export interface TranscriptLine {
  speaker: 'agent' | 'caller';
  text: string;
  at?: string;
}

export interface CallLog {
  id: ID;
  provider: string;
  externalCallId: string;
  direction: CallDirection;
  contactName?: string;
  contactPhone: string;
  clinicNumber: string;
  startedAt: string;
  endedAt?: string;
  durationSec: number;
  status: CallStatus;
  summary: string;
  transcript: TranscriptLine[];
  appointmentId?: ID;
}

export interface ReminderCallResult {
  placed: boolean;
  message: string;
}

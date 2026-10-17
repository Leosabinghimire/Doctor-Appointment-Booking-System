import { config } from '../config';
import { sql } from '../db/connection';

export const PHOTO_MAX_BYTES = 2 * 1024 * 1024;

export type PhotoMime = 'image/jpeg' | 'image/png' | 'image/webp';

/**
 * Identifies the image type from its first bytes. The browser-supplied Content-Type
 * is never trusted — a renamed HTML or SVG file must not be stored and served as an image.
 */
export const sniffImageType = (data: Buffer): PhotoMime | undefined => {
  if (data.length >= 3 && data[0] === 0xff && data[1] === 0xd8 && data[2] === 0xff) return 'image/jpeg';
  if (data.length >= 8 && data.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) {
    return 'image/png';
  }
  if (data.length >= 12 && data.toString('ascii', 0, 4) === 'RIFF' && data.toString('ascii', 8, 12) === 'WEBP') {
    return 'image/webp';
  }
  return undefined;
};

/**
 * The avatar URL to show for a doctor: the uploaded photo if there is one (with a version
 * so browsers re-fetch after a change), otherwise the pasted link (or '' for initials).
 */
export const avatarUrl = (doctorId: string, photoUpdatedAt: number | null, pastedLink: string) =>
  photoUpdatedAt === null ? pastedLink : `${config.publicUrl}/v1/doctors/${doctorId}/photo?v=${photoUpdatedAt}`;

export const doctorPhotosRepo = {
  get: (doctorId: string) =>
    sql.prepare('SELECT mime, data, updated_at FROM doctor_photos WHERE doctor_id = ?').get(doctorId) as
      | { mime: PhotoMime; data: Buffer; updated_at: number }
      | undefined,

  save: (doctorId: string, mime: PhotoMime, data: Buffer) => {
    sql
      .prepare(
        `INSERT INTO doctor_photos (doctor_id, mime, data, updated_at) VALUES (?, ?, ?, ?)
         ON CONFLICT (doctor_id) DO UPDATE SET mime = excluded.mime, data = excluded.data, updated_at = excluded.updated_at`
      )
      .run(doctorId, mime, data, Date.now());
  },

  remove: (doctorId: string) => sql.prepare('DELETE FROM doctor_photos WHERE doctor_id = ?').run(doctorId).changes > 0,
};

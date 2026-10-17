import { randomBytes } from 'node:crypto';

try {
  process.loadEnvFile();
} catch {
  // No .env file — fall back to real environment variables / defaults.
}

const optional = (value: string | undefined) => (value && value.trim() ? value.trim() : undefined);

const isProduction = process.env.NODE_ENV === 'production';

/** In production a missing secret is a startup error; in development we fall back to a dev default. */
const secret = (name: string, devFallback: () => string): string => {
  const value = optional(process.env[name]);
  if (value) return value;
  if (isProduction) throw new Error(`${name} must be set in production`);
  return devFallback();
};

export const config = {
  port: Number(process.env.PORT ?? 4000),
  corsOrigins: (process.env.CORS_ORIGIN ?? 'http://localhost:5173').split(',').map((o) => o.trim()),
  isProduction,
  auth: {
    // Dev fallback is random per start, so sessions end when the server restarts (data resets too).
    jwtSecret: secret('JWT_SECRET', () => randomBytes(32).toString('hex')),
    tokenTtl: process.env.JWT_EXPIRES_IN ?? '8h',
    adminEmail: process.env.ADMIN_EMAIL ?? 'admin@medicare.example',
    adminPassword: secret('ADMIN_PASSWORD', () => 'admin-dev-password'),
    // Demo patient account (alex.morgan@example.com) — only seeded outside production.
    demoPatientPassword: isProduction ? undefined : (optional(process.env.DEMO_PATIENT_PASSWORD) ?? 'patient-dev-password'),
  },
  telentir: {
    apiKey: optional(process.env.TELENTIR_API_KEY),
    apiUrl: optional(process.env.TELENTIR_API_URL),
    agentId: optional(process.env.TELENTIR_AGENT_ID),
    knowledgeBaseId: optional(process.env.TELENTIR_KNOWLEDGE_BASE_ID),
    syncIntervalSec: Number(process.env.TELENTIR_SYNC_INTERVAL_SEC ?? 60),
  },
} as const;

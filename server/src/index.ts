import cors from 'cors';
import express from 'express';
import { config } from './config';
import { sql } from './db/connection';
import { seedDatabase } from './db/seed';
import { errorHandler } from './http';
import { api } from './routes';
import { isTelentirEnabled } from './telentir/client';
import { startCallSync } from './telentir/calls';

const app = express();

// Behind a proxy in production, so req.ip (used by the login rate limiter) is the client's IP.
if (config.isProduction) app.set('trust proxy', 1);

app.use(cors({ origin: config.corsOrigins }));
app.use(express.json({ limit: '100kb' }));
app.use('/v1', api);
app.use(errorHandler);

await seedDatabase();

app.listen(config.port, () => {
  console.log(`MediCare+ API listening on http://localhost:${config.port}/v1`);
  console.log(
    isTelentirEnabled()
      ? '[telentir] enabled — syncing call history'
      : '[telentir] disabled (no TELENTIR_API_KEY) — serving demo call logs'
  );
  if (!config.isProduction) {
    console.log(`[auth] dev accounts: ${config.auth.adminEmail} / ${config.auth.adminPassword} (admin), alex.morgan@example.com / ${config.auth.demoPatientPassword} (patient)`);
  }
  startCallSync();
});

// Close the database cleanly so the WAL file is checkpointed.
for (const signal of ['SIGINT', 'SIGTERM'] as const) {
  process.on(signal, () => {
    sql.close();
    process.exit(0);
  });
}

import cors from 'cors';
import express from 'express';
import { config } from './config';
import { errorHandler } from './http';
import { api } from './routes';
import { isTelentirEnabled } from './telentir/client';
import { startCallSync } from './telentir/calls';

const app = express();

app.use(cors({ origin: config.corsOrigins }));
app.use(express.json());
app.use('/v1', api);
app.use(errorHandler);

app.listen(config.port, () => {
  console.log(`MediCare+ API listening on http://localhost:${config.port}/v1`);
  console.log(
    isTelentirEnabled()
      ? '[telentir] enabled — syncing call history'
      : '[telentir] disabled (no TELENTIR_API_KEY) — serving demo call logs'
  );
  startCallSync();
});

import { Telentir, crypto } from '@silyze/telentir-sdk';
import { config } from '../config';
import { HttpError } from '../http';

type TelentirClient = Awaited<ReturnType<typeof Telentir.connect<unknown>>>;

let clientPromise: Promise<TelentirClient> | undefined;

export const isTelentirEnabled = () => Boolean(config.telentir.apiKey);

/**
 * Lazily connects the Telentir SDK once and reuses it.
 * The API key never leaves the backend — the browser only talks to our REST API.
 */
export const getTelentir = (): Promise<TelentirClient> => {
  if (!config.telentir.apiKey) {
    throw new HttpError(503, 'Telentir is not configured. Set TELENTIR_API_KEY in server/.env.', 'TELENTIR_DISABLED');
  }
  clientPromise ??= (async () =>
    Telentir.connect<unknown>({
      apiKey: config.telentir.apiKey!,
      api: config.telentir.apiUrl,
      // Same setup as Telentir's official example; WebCrypto is built into Node 20+.
      crypto: new crypto.BrowserCrypto(await import('jose')),
      keyCache: new crypto.InMemoryKeyCache(),
    }))().catch((err) => {
    clientPromise = undefined; // allow a retry on the next request
    throw err;
  });
  return clientPromise;
};

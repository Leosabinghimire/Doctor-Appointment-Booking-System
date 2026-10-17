try {
  process.loadEnvFile();
} catch {
  // No .env file — fall back to real environment variables / defaults.
}

const optional = (value: string | undefined) => (value && value.trim() ? value.trim() : undefined);

export const config = {
  port: Number(process.env.PORT ?? 4000),
  corsOrigins: (process.env.CORS_ORIGIN ?? 'http://localhost:5173').split(',').map((o) => o.trim()),
  telentir: {
    apiKey: optional(process.env.TELENTIR_API_KEY),
    apiUrl: optional(process.env.TELENTIR_API_URL),
    agentId: optional(process.env.TELENTIR_AGENT_ID),
    knowledgeBaseId: optional(process.env.TELENTIR_KNOWLEDGE_BASE_ID),
    syncIntervalSec: Number(process.env.TELENTIR_SYNC_INTERVAL_SEC ?? 60),
  },
} as const;

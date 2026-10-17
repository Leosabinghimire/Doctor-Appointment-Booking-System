/**
 * Uploads the clinic's doctor directory to a Telentir knowledge base.
 * Run with `npm run telentir:knowledge` from the server folder.
 *
 * - If TELENTIR_KNOWLEDGE_BASE_ID is set, uploads into that knowledge base.
 * - Otherwise creates a new one and prints its ID to put in server/.env.
 *
 * Re-run whenever the doctor list changes (delete the old document in the
 * Telentir dashboard first to avoid duplicates).
 */
import { config } from '../src/config';
import { buildClinicKnowledge } from '../src/telentir/knowledge';
import { getTelentir } from '../src/telentir/client';

const main = async () => {
  const telentir = await getTelentir();

  let kbId = config.telentir.knowledgeBaseId;
  if (!kbId) {
    const kb = await telentir.knowledgeBases.create({
      name: 'MediCare+ Clinic',
      description: 'Doctor directory, fees and visit types for the MediCare+ phone agent',
    });
    kbId = kb.id;
    console.log(`Created knowledge base ${kbId}. Add this to server/.env:\nTELENTIR_KNOWLEDGE_BASE_ID=${kbId}\n`);
  }

  const docs = await telentir.knowledgeBases.uploadDocuments(kbId, [
    {
      name: 'medicare-clinic-info.txt',
      type: 'text/plain',
      data: new TextEncoder().encode(buildClinicKnowledge()),
    },
  ]);
  console.log(`Uploaded ${docs.map((d) => d.name).join(', ')} to knowledge base ${kbId}.`);

  const hits = await telentir.knowledgeBases.search(kbId, 'cardiologist fee');
  console.log(`Test search "cardiologist fee" → ${hits.length} hit(s).`);
};

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});

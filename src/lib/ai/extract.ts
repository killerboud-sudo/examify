import { generateObject } from 'ai';
import { Exam } from '../schema';
import { PROVIDERS, type ProviderId } from './providers';

const SYSTEM = `You transcribe photos of Arabic school math exams into structured JSON.
Rules:
- Keep Arabic text exactly as written (fix only obvious handwriting ambiguity). Do not solve anything.
- Every math expression becomes LaTeX, French notation: decimal comma as {,} (0{,}0075), \\times, \\div, \\dfrac for fractions.
- Inline math inside Arabic sentences goes between $...$ . Standalone formulas become "equation" blocks.
- One section per exercise/situation; title includes the points if written (e.g. "التمرين الأول - 06 نقاط").
- A geometric figure becomes a "figure" block (template right-triangle) with its letters and side labels.
- Years: write them in normal order (2025/2026), not mirrored.
- Header goes to header.rightLines / leftLines, teacher name to subtitle/footerRight, "بالتوفيق" to footerLeft.
- Use empty strings when something is absent.`;

export async function extractExam(provider: ProviderId, imageDataUrl: string) {
  const { object } = await generateObject({
    model: PROVIDERS[provider].model(),
    schema: Exam,
    system: SYSTEM,
    maxRetries: 1,
    messages: [{ role: 'user', content: [
      { type: 'text', text: 'Transcribe this exam into the schema.' },
      { type: 'image', image: imageDataUrl },
    ] }],
  });
  // assign stable ids client-side usage
  return { ...object, sections: object.sections.map((s) => ({ ...s, id: s.id || crypto.randomUUID() })) };
}

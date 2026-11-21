import { z } from 'zod';

/**
 * Single source of truth for an exam. AI extraction fills ExamAI; the app adds ids, template, images, page breaks.
 * All AI fields are required (no optionals) so it also works with strict structured outputs (OpenAI).
 * Math is LaTeX, French notation: decimal comma written as {,}  e.g. 0{,}0075
 */
export const TextBlock = z.object({ type: z.literal('text'), text: z.string().describe('Arabic text; inline math between $...$'), bold: z.boolean() });
export const EquationBlock = z.object({ type: z.literal('equation'), latex: z.string() });
export const FigureBlock = z.object({
  type: z.literal('figure'),
  template: z.enum(['right-triangle']),
  vertexRight: z.string().describe('Letter at the right angle, e.g. R'),
  vertexBase: z.string().describe('Letter at the end of the horizontal side, e.g. S'),
  vertexTop: z.string().describe('Letter at the top, e.g. T'),
  baseLabel: z.string().describe('e.g. "3 cm"'),
  heightLabel: z.string().describe('e.g. "4 cm"'),
});
export const TableBlock = z.object({
  type: z.literal('table'),
  rows: z.array(z.array(z.object({
    text: z.string().describe('cell content; math between $...$'),
    colspan: z.number().describe('1 if not merged'), rowspan: z.number().describe('1 if not merged'),
    header: z.boolean(),
  }))).describe('HTML-style: a merged cell appears once (anchor); the cells it covers are omitted'),
  widths: z.array(z.number()).describe('always []'),
  bordered: z.boolean().describe('true unless the table has no visible borders'),
});
export const AIBlock = z.discriminatedUnion('type', [TextBlock, EquationBlock, FigureBlock, TableBlock]);
export const ImageBlock = z.object({ type: z.literal('image'), src: z.string(), width: z.number(), align: z.enum(['left', 'center', 'right']), wrap: z.boolean() });
export const PageBreakBlock = z.object({ type: z.literal('pagebreak') });

export type Block = z.infer<typeof AIBlock> | z.infer<typeof ImageBlock> | z.infer<typeof PageBreakBlock>;

export const ExamAI = z.object({
  header: z.object({
    school: z.string().describe('School name only (after "متوسطة:")'),
    directorate: z.string().describe('Wilaya only (after "مديرية التربية لولاية:")'),
    level: z.string(), duration: z.string(), day: z.string(),
    calculatorAllowed: z.boolean(),
  }),
  title: z.string(), subtitle: z.string(),
  sections: z.array(z.object({
    title: z.string().describe('e.g. "التمرين الأول" — WITHOUT the points'),
    points: z.number().describe('points of this exercise, 0 if not written'),
    blocks: z.array(AIBlock),
  })),
  footerRight: z.string(), footerLeft: z.string(),
});

export type Section = { id: string; title: string; points: number; breakAfter: boolean; blocks: Block[] };
export type Exam = Omit<z.infer<typeof ExamAI>, 'sections'> & { templateId: string; fontFamily: string; fontSize: number; sections: Section[] };

export const DEFAULT_TEMPLATE = 'navy';
export const toExam = (ai: z.infer<typeof ExamAI>, templateId = DEFAULT_TEMPLATE): Exam => ({
  ...ai, templateId, fontFamily: 'amiri', fontSize: 15,
  sections: ai.sections.map((s) => ({ ...s, id: crypto.randomUUID(), breakAfter: false })),
});
export const emptyExam = (): Exam => ({
  templateId: DEFAULT_TEMPLATE, fontFamily: 'amiri', fontSize: 15,
  header: { school: '', directorate: '', level: '', duration: '', day: '', calculatorAllowed: false },
  title: 'الفرض المحروس الأول', subtitle: '', sections: [], footerRight: '', footerLeft: 'بالتوفيق',
});

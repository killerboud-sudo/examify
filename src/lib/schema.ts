import { z } from 'zod';

/**
 * Single source of truth for an exam.
 * Everything (AI extraction, editor, preview, future exporters) speaks this shape.
 * All fields are required (no optionals) so it also works with strict structured outputs (OpenAI).
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
export const Block = z.discriminatedUnion('type', [TextBlock, EquationBlock, FigureBlock]);
export type Block = z.infer<typeof Block>;

export const Section = z.object({
  id: z.string(),
  title: z.string().describe('e.g. "التمرين الأول - 06 نقاط"'),
  blocks: z.array(Block),
});
export type Section = z.infer<typeof Section>;

export const Exam = z.object({
  header: z.object({
    rightLines: z.array(z.string()).describe('Header lines shown on the right (directorate, school, level, year...)'),
    leftLines: z.array(z.string()).describe('Header lines shown on the left (duration...)'),
  }),
  title: z.string(),
  subtitle: z.string(),
  sections: z.array(Section),
  footerRight: z.string(),
  footerLeft: z.string(),
});
export type Exam = z.infer<typeof Exam>;

export const emptyExam = (): Exam => ({
  header: { rightLines: ['المستوى: '], leftLines: ['المدة: '] },
  title: 'اختبار في مادة الرياضيات', subtitle: '',
  sections: [], footerRight: '', footerLeft: 'بالتوفيق',
});

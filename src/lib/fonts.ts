/** Add a font: one entry here + its import in app/layout.tsx. */
export const FONTS = [
  { id: 'amiri', label: 'Amiri', cssVar: '--f-amiri' },
  { id: 'naskh', label: 'Noto Naskh', cssVar: '--f-naskh' },
  { id: 'scheherazade', label: 'Scheherazade', cssVar: '--f-sch' },
  { id: 'cairo', label: 'Cairo', cssVar: '--f-cairo' },
  { id: 'tajawal', label: 'Tajawal', cssVar: '--f-tajawal' },
] as const;
export const fontStack = (id: string) => `var(${(FONTS.find((f) => f.id === id) ?? FONTS[0]).cssVar}), serif`;

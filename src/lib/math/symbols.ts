export type Sym = { l: string; t: string };
export type Category = { id: string; label: string; items: Sym[] };

/** Add a symbol or a whole category here; the modal picks it up automatically. */
export const CATEGORIES: Category[] = [
  { id: 'basic', label: 'أساسي', items: [
    { l: 'كسر', t: '\\dfrac{a}{b}' }, { l: 'جذر', t: '\\sqrt{x}' }, { l: 'جذر نوني', t: '\\sqrt[n]{x}' },
    { l: 'أس', t: 'x^{2}' }, { l: 'دليل', t: 'x_{1}' }, { l: 'ضرب', t: '\\times' }, { l: 'قسمة', t: '\\div' },
    { l: 'زائد/ناقص', t: '\\pm' }, { l: 'نقطة ضرب', t: '\\cdot' }, { l: 'فاصلة عشرية', t: '0{,}5' },
    { l: 'نسبة مئوية', t: '\\%' }, { l: 'قيمة مطلقة', t: '\\left|x\\right|' }, { l: 'قوة 10', t: '10^{-3}' },
    { l: 'مضروب', t: 'n!' }, { l: 'كسر متداخل', t: '\\dfrac{\\dfrac{a}{b}}{\\dfrac{c}{d}}' },
  ] },
  { id: 'relations', label: 'علاقات', items: [
    { l: 'لا يساوي', t: '\\neq' }, { l: 'أصغر', t: '<' }, { l: 'أكبر', t: '>' }, { l: 'أصغر أو يساوي', t: '\\leq' },
    { l: 'أكبر أو يساوي', t: '\\geq' }, { l: 'تقريبًا', t: '\\approx' }, { l: 'تكافؤ', t: '\\equiv' },
    { l: 'يستلزم', t: '\\Rightarrow' }, { l: 'يكافئ', t: '\\Leftrightarrow' }, { l: 'سهم', t: '\\to' },
    { l: 'يتناسب مع', t: '\\propto' }, { l: 'يشبه', t: '\\sim' },
  ] },
  { id: 'geometry', label: 'هندسة', items: [
    { l: 'زاوية', t: '\\widehat{ABC}' }, { l: 'شعاع', t: '\\overrightarrow{AB}' }, { l: 'قطعة', t: '\\overline{AB}' },
    { l: 'مستقيم', t: '(AB)' }, { l: 'يوازي', t: '\\parallel' }, { l: 'يعامد', t: '\\perp' }, { l: 'درجة', t: '^{\\circ}' },
    { l: 'مثلث', t: '\\triangle ABC' }, { l: 'زاوية ∠', t: '\\angle' }, { l: 'يطابق', t: '\\cong' },
    { l: 'سم', t: '\\text{ cm}' }, { l: 'سم²', t: '\\text{ cm}^{2}' }, { l: 'جيب التمام', t: '\\cos\\widehat{ABC}' },
    { l: 'جيب', t: '\\sin\\widehat{ABC}' }, { l: 'ظل', t: '\\tan\\widehat{ABC}' }, { l: 'باي', t: '\\pi' },
  ] },
  { id: 'greek', label: 'إغريقي', items: ['\\alpha', '\\beta', '\\gamma', '\\delta', '\\varepsilon', '\\theta', '\\lambda', '\\mu', '\\pi', '\\rho', '\\sigma', '\\varphi', '\\omega', '\\Delta', '\\Sigma', '\\Omega']
    .map((t) => ({ l: t.slice(1), t })) },
  { id: 'brackets', label: 'أقواس ومجموعات', items: [
    { l: 'أقواس كبيرة', t: '\\left( x \\right)' }, { l: 'معقوفتان', t: '\\left[ x \\right]' }, { l: 'حاصرتان', t: '\\left\\{ x \\right\\}' },
    { l: 'مجال', t: '\\left[a\\,;b\\right]' }, { l: 'ينتمي', t: '\\in' }, { l: 'لا ينتمي', t: '\\notin' },
    { l: 'جزء من', t: '\\subset' }, { l: 'اتحاد', t: '\\cup' }, { l: 'تقاطع', t: '\\cap' }, { l: 'مجموعة خالية', t: '\\emptyset' },
    { l: 'ℕ', t: '\\mathbb{N}' }, { l: 'ℤ', t: '\\mathbb{Z}' }, { l: 'ℚ', t: '\\mathbb{Q}' }, { l: 'ℝ', t: '\\mathbb{R}' },
    { l: 'ما لا نهاية', t: '\\infty' },
  ] },
  { id: 'functions', label: 'دوال', items: [
    { l: 'جمع', t: '\\sum_{i=1}^{n}' }, { l: 'تكامل', t: '\\int_{a}^{b}' }, { l: 'نهاية', t: '\\lim_{x\\to 0}' },
    { l: 'لوغاريتم', t: '\\log' }, { l: 'لوغاريتم نيبري', t: '\\ln' }, { l: 'دالة', t: 'f(x)=' },
    { l: 'جملة معادلات', t: '\\begin{cases} x+y=1 \\\\ x-y=3 \\end{cases}' },
    { l: 'مصفوفة', t: '\\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix}' },
  ] },
];
export const ALL: Sym[] = CATEGORIES.flatMap((c) => c.items);

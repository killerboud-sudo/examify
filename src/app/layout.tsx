import type { Metadata } from 'next';
import { Amiri, Noto_Naskh_Arabic, Scheherazade_New, Cairo, Tajawal } from 'next/font/google';
import 'katex/dist/katex.min.css';
import './globals.css';

const o = { subsets: ['arabic', 'latin'] as ('arabic' | 'latin')[], display: 'swap' as const };
const amiri = Amiri({ ...o, weight: ['400', '700'], variable: '--f-amiri' });
const naskh = Noto_Naskh_Arabic({ ...o, variable: '--f-naskh' });
const sch = Scheherazade_New({ ...o, weight: ['400', '700'], variable: '--f-sch' });
const cairo = Cairo({ ...o, variable: '--f-cairo' });
const tajawal = Tajawal({ ...o, weight: ['400', '500', '700'], variable: '--f-tajawal' });
export const metadata: Metadata = { title: 'منشئ الاختبارات', description: 'حوّل صورة الاختبار إلى وثيقة منسقة قابلة للتعديل' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="ar" dir="rtl" className={[amiri, naskh, sch, cairo, tajawal].map((f) => f.variable).join(' ')}><body>{children}</body></html>;
}

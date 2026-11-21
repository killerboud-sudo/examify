import type { Metadata } from 'next';
import { Amiri } from 'next/font/google';
import 'katex/dist/katex.min.css';
import './globals.css';

const amiri = Amiri({ subsets: ['arabic', 'latin'], weight: ['400', '700'], display: 'swap' });
export const metadata: Metadata = { title: 'منشئ الاختبارات', description: 'حوّل صورة الاختبار إلى وثيقة منسقة قابلة للتعديل' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="ar" dir="rtl"><body className={amiri.className}>{children}</body></html>;
}


import type { Metadata } from 'next';
import {
  Amiri,
  Noto_Naskh_Arabic,
  Scheherazade_New,
  Cairo,
  Tajawal,
} from 'next/font/google';

import 'katex/dist/katex.min.css';
import './globals.css';

const amiri = Amiri({
  subsets: ['arabic', 'latin'],
  weight: ['400', '700'],
  display: 'swap',
  variable: '--f-amiri',
});

const naskh = Noto_Naskh_Arabic({
  subsets: ['arabic', 'latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
  variable: '--f-naskh',
});

const sch = Scheherazade_New({
  subsets: ['arabic', 'latin'],
  weight: ['400', '700'],
  display: 'swap',
  variable: '--f-sch',
});

const cairo = Cairo({
  subsets: ['arabic', 'latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
  variable: '--f-cairo',
});

const tajawal = Tajawal({
  subsets: ['arabic', 'latin'],
  weight: ['400', '500', '700'],
  display: 'swap',
  variable: '--f-tajawal',
});

export const metadata: Metadata = {
  title: 'منشئ الاختبارات',
  description: 'حوّل صورة الاختبار إلى وثيقة منسقة قابلة للتعديل',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="ar"
      dir="rtl"
      className={[
        amiri.variable,
        naskh.variable,
        sch.variable,
        cairo.variable,
        tajawal.variable,
      ].join(' ')}
    >
      <body>{children}</body>
    </html>
  );
}

'use client';
import { useEffect, useRef, useState } from 'react';
import { emptyExam, type Exam } from '@/lib/schema';
import { ExamEditor, type Selection } from '@/components/ExamEditor';
import { ExamPreview } from '@/components/ExamPreview';

const LABELS: Record<string, string> = { claude: 'Claude', gemini: 'Gemini', openai: 'ChatGPT' };

/** Downscale in the browser: keeps requests under Vercel's ~4.5 MB body limit. */
async function compress(file: File, max = 1800): Promise<string> {
  const bmp = await createImageBitmap(file);
  const k = Math.min(1, max / Math.max(bmp.width, bmp.height));
  const c = document.createElement('canvas'); c.width = bmp.width * k; c.height = bmp.height * k;
  c.getContext('2d')!.drawImage(bmp, 0, 0, c.width, c.height);
  return c.toDataURL('image/jpeg', 0.85);
}

export default function Home() {
  const [exam, setExam] = useState<Exam>(emptyExam());
  const [providers, setProviders] = useState<string[]>([]);
  const [provider, setProvider] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [sel, setSel] = useState<Selection>(null);
  const file = useRef<HTMLInputElement>(null);

  useEffect(() => { fetch('/api/extract').then((r) => r.json()).then((d) => { setProviders(d.providers); setProvider(d.providers[0] ?? ''); }); }, []);

  async function upload(f: File) {
    setBusy(true); setError('');
    try {
      const res = await fetch('/api/extract', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ image: await compress(f), provider }) });
      const d = await res.json();
      if (!res.ok) throw new Error(d.error);
      setExam(d.exam); setSel(null);
    } catch (e) { setError(e instanceof Error ? e.message : 'فشل الاستخراج'); }
    setBusy(false);
  }

  return (
    <main className="app">
      <aside className="side">
        <h1>منشئ الاختبارات</h1>
        {sel === null && <div className="card">
          <div className="row">
            <select value={provider} onChange={(e) => setProvider(e.target.value)} disabled={!providers.length}>
              {providers.length ? providers.map((p) => <option key={p} value={p}>{LABELS[p]}</option>) : <option>لا يوجد نموذج مفعّل</option>}
            </select>
            <button className="primary" disabled={busy || !provider} onClick={() => file.current?.click()}>{busy ? 'جارٍ التحليل…' : 'رفع صورة اختبار'}</button>
          </div>
          <input ref={file} type="file" accept="image/*" hidden onChange={(e) => e.target.files?.[0] && upload(e.target.files[0])} />
          {error && <p className="err">{error}</p>}
        </div>}
        <ExamEditor exam={exam} onChange={setExam} sel={sel} setSel={setSel} />
      </aside>
      <section className="preview">
        <div className="bar"><button className="primary" onClick={() => window.print()}>طباعة / حفظ PDF</button></div>
        <ExamPreview exam={exam} />
      </section>
    </main>
  );
}

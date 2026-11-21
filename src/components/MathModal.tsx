'use client';
import { useEffect, useMemo, useRef, useState } from 'react';
import katex from 'katex';
import { ALL, CATEGORIES } from '@/lib/math/symbols';

export type MathMode = 'inline' | 'display';
type Props = {
  open: boolean; initial?: string; allowModeToggle?: boolean;
  onSubmit: (latex: string, mode: MathMode) => void; onClose: () => void;
};

export function MathModal({ open, initial = '', allowModeToggle = false, onSubmit, onClose }: Props) {
  const [code, setCode] = useState(initial);
  const [mode, setMode] = useState<MathMode>(allowModeToggle ? 'inline' : 'display');
  const [cat, setCat] = useState('all');
  const area = useRef<HTMLTextAreaElement>(null);

  useEffect(() => { if (open) { setCode(initial); setMode(allowModeToggle ? 'inline' : 'display'); setTimeout(() => area.current?.focus(), 0); } }, [open, initial, allowModeToggle]);

  const html = useMemo(() => {
    try { return katex.renderToString(code || '\\;', { displayMode: mode === 'display', throwOnError: true }); }
    catch { return null; }
  }, [code, mode]);

  if (!open) return null;
  const items = cat === 'all' ? ALL : CATEGORIES.find((c) => c.id === cat)!.items;

  function insert(t: string) {
    const el = area.current; const s = el?.selectionStart ?? code.length; const e = el?.selectionEnd ?? code.length;
    const next = code.slice(0, s) + t + code.slice(e);
    setCode(next);
    setTimeout(() => { el?.focus(); el?.setSelectionRange(s + t.length, s + t.length); }, 0);
  }
  const submit = () => code.trim() && html && onSubmit(code.trim(), mode);

  return (
    <div className="overlay" onMouseDown={onClose}>
      <div className="modal" role="dialog" aria-modal="true" aria-label="إدراج معادلة" onMouseDown={(e) => e.stopPropagation()}
        onKeyDown={(e) => { if (e.key === 'Escape') onClose(); if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) submit(); }}>
        <div className="mhead"><h3>المعادلة</h3><button onClick={onClose} aria-label="إغلاق">✕</button></div>
        {allowModeToggle && (
          <div className="seg" role="tablist">
            <button className={mode === 'inline' ? 'on' : ''} onClick={() => setMode('inline')}>داخل السطر ($)</button>
            <button className={mode === 'display' ? 'on' : ''} onClick={() => setMode('display')}>سطر مستقل ($$)</button>
          </div>)}
        <div className="mlabel">المعاينة البصرية المباشرة</div>
        <div className="mpreview" dir="ltr">{html ? <span dangerouslySetInnerHTML={{ __html: html }} /> : <span className="err">صيغة غير صحيحة</span>}</div>
        <div className="mlabel">إدراج رموز سريعة</div>
        <div className="tabs">
          {[{ id: 'all', label: 'الكل' }, ...CATEGORIES].map((c) => <button key={c.id} className={cat === c.id ? 'on' : ''} onClick={() => setCat(c.id)}>{c.label}</button>)}
        </div>
        <div className="chips">
          {items.map((s, i) => (
            <button key={i} className="chip" onClick={() => insert(s.t)} title={s.t}>
              <span>{s.l}</span><code dir="ltr">{s.t.length > 22 ? s.t.slice(0, 20) + '…' : s.t}</code>
            </button>))}
        </div>
        <div className="mlabel">كود LaTeX للمعادلة <small>Ctrl + Enter للحفظ السريع</small></div>
        <textarea ref={area} dir="ltr" className="code" rows={4} value={code} onChange={(e) => setCode(e.target.value)} spellCheck={false} />
        <div className="mfoot"><button onClick={onClose}>إلغاء</button><button className="primary" disabled={!code.trim() || !html} onClick={submit}>إدراج</button></div>
      </div>
    </div>
  );
}

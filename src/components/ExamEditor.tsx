'use client';
import { useRef, useState } from 'react';
import type { Exam, Block, Section } from '@/lib/schema';
import { FIGURES } from '@/lib/figures/registry';
import { Equation, RichText } from './Tex';
import { MathModal, type MathMode } from './MathModal';

export type Selection = null | 'header' | { section: string };
type Props = { exam: Exam; onChange: (e: Exam) => void; sel: Selection; setSel: (s: Selection) => void };
const move = <T,>(a: T[], i: number, d: number) => { const j = i + d; if (j < 0 || j >= a.length) return a; const c = [...a]; [c[i], c[j]] = [c[j], c[i]]; return c; };

/** Panel = outline (short list, one "edit" button per item) OR the form of the one selected item. */
export function ExamEditor({ exam, onChange, sel, setSel }: Props) {
  if (sel === 'header') return <HeaderForm exam={exam} onChange={onChange} back={() => setSel(null)} />;
  if (sel) {
    const si = exam.sections.findIndex((s) => s.id === sel.section);
    if (si >= 0) return <SectionForm section={exam.sections[si]} onChange={(s) => onChange({ ...exam, sections: exam.sections.map((x, i) => (i === si ? s : x)) })} back={() => setSel(null)} />;
  }
  return (
    <ul className="outline">
      <li className="orow"><span className="grow">الترويسة والعنوان</span><button onClick={() => setSel('header')}>تعديل</button></li>
      {exam.sections.map((s, i) => (
        <li className="orow" key={s.id}>
          <span className="grow">{s.title || 'تمرين بلا عنوان'}</span>
          <button aria-label="أعلى" onClick={() => onChange({ ...exam, sections: move(exam.sections, i, -1) })}>↑</button>
          <button aria-label="أسفل" onClick={() => onChange({ ...exam, sections: move(exam.sections, i, 1) })}>↓</button>
          <button onClick={() => setSel({ section: s.id })}>تعديل</button>
          <button className="danger" aria-label="حذف" onClick={() => confirm('حذف هذا التمرين؟') && onChange({ ...exam, sections: exam.sections.filter((_, k) => k !== i) })}>×</button>
        </li>))}
      <li><button className="primary wide" onClick={() => { const id = crypto.randomUUID(); onChange({ ...exam, sections: [...exam.sections, { id, title: 'تمرين جديد', blocks: [] }] }); setSel({ section: id }); }}>+ إضافة تمرين</button></li>
    </ul>
  );
}

const Back = ({ back, title }: { back: () => void; title: string }) => <div className="ehead"><button onClick={back}>→ رجوع</button><h2>{title}</h2></div>;

function HeaderForm({ exam, onChange, back }: { exam: Exam; onChange: (e: Exam) => void; back: () => void }) {
  return (
    <div className="editor">
      <Back back={back} title="الترويسة والعنوان" />
      <label>العنوان<input value={exam.title} onChange={(e) => onChange({ ...exam, title: e.target.value })} /></label>
      <label>العنوان الفرعي<input value={exam.subtitle} onChange={(e) => onChange({ ...exam, subtitle: e.target.value })} /></label>
      <label>أسطر الترويسة (يمين) — سطر في كل سطر
        <textarea rows={3} value={exam.header.rightLines.join('\n')} onChange={(e) => onChange({ ...exam, header: { ...exam.header, rightLines: e.target.value.split('\n') } })} /></label>
      <label>أسطر الترويسة (يسار)
        <textarea rows={2} value={exam.header.leftLines.join('\n')} onChange={(e) => onChange({ ...exam, header: { ...exam.header, leftLines: e.target.value.split('\n') } })} /></label>
      <label>التذييل (يمين)<input value={exam.footerRight} onChange={(e) => onChange({ ...exam, footerRight: e.target.value })} /></label>
      <label>التذييل (يسار)<input value={exam.footerLeft} onChange={(e) => onChange({ ...exam, footerLeft: e.target.value })} /></label>
    </div>
  );
}

type Target = { kind: 'new' } | { kind: 'edit'; bi: number } | { kind: 'insert'; bi: number };

function SectionForm({ section: s, onChange, back }: { section: Section; onChange: (s: Section) => void; back: () => void }) {
  const [target, setTarget] = useState<Target | null>(null);
  const carets = useRef<Record<number, number>>({});
  const setBlock = (bi: number, b: Block) => onChange({ ...s, blocks: s.blocks.map((x, i) => (i === bi ? b : x)) });
  const add = (b: Block) => onChange({ ...s, blocks: [...s.blocks, b] });

  function submit(latex: string, mode: MathMode) {
    const t = target!; setTarget(null);
    if (t.kind === 'new') return add({ type: 'equation', latex });
    const b = s.blocks[t.bi];
    if (t.kind === 'edit' && b.type === 'equation') return setBlock(t.bi, { ...b, latex });
    if (t.kind === 'insert' && b.type === 'text') {
      if (mode === 'display') { const blocks = [...s.blocks]; blocks.splice(t.bi + 1, 0, { type: 'equation', latex }); return onChange({ ...s, blocks }); }
      const at = carets.current[t.bi] ?? b.text.length;
      setBlock(t.bi, { ...b, text: b.text.slice(0, at) + `$${latex}$` + b.text.slice(at) });
    }
  }
  const cur = target?.kind === 'edit' ? s.blocks[target.bi] : null;

  return (
    <div className="editor">
      <Back back={back} title="تعديل التمرين" />
      <label>عنوان التمرين<input value={s.title} onChange={(e) => onChange({ ...s, title: e.target.value })} /></label>
      {s.blocks.map((b, bi) => (
        <div className="blk" key={bi}>
          <div className="row">
            <span className="tag">{b.type === 'text' ? 'نص' : b.type === 'equation' ? 'معادلة' : 'شكل'}</span>
            <button aria-label="أعلى" onClick={() => onChange({ ...s, blocks: move(s.blocks, bi, -1) })}>↑</button>
            <button aria-label="أسفل" onClick={() => onChange({ ...s, blocks: move(s.blocks, bi, 1) })}>↓</button>
            <button className="danger" aria-label="حذف" onClick={() => onChange({ ...s, blocks: s.blocks.filter((_, i) => i !== bi) })}>×</button>
          </div>
          {b.type === 'text' && (<>
            <textarea rows={2} value={b.text} onChange={(e) => setBlock(bi, { ...b, text: e.target.value })}
              onSelect={(e) => (carets.current[bi] = e.currentTarget.selectionStart)} onBlur={(e) => (carets.current[bi] = e.currentTarget.selectionStart)} />
            <div className="row"><label className="chk"><input type="checkbox" checked={b.bold} onChange={(e) => setBlock(bi, { ...b, bold: e.target.checked })} /> غليظ</label>
              <button onClick={() => setTarget({ kind: 'insert', bi })}>∑ إدراج معادلة</button></div>
            <div className="mini"><RichText text={b.text} /></div></>)}
          {b.type === 'equation' && (<>
            <div className="mini"><Equation latex={b.latex} /></div>
            <button onClick={() => setTarget({ kind: 'edit', bi })}>تعديل المعادلة</button></>)}
          {b.type === 'figure' && (
            <div className="grid2" dir="ltr">
              {(['vertexTop', 'vertexRight', 'vertexBase', 'heightLabel', 'baseLabel'] as const).map((k) => (
                <label key={k}>{k}<input value={b[k]} onChange={(e) => setBlock(bi, { ...b, [k]: e.target.value })} /></label>))}
            </div>)}
        </div>))}
      <div className="row">
        <button onClick={() => add({ type: 'text', text: '', bold: true })}>+ نص</button>
        <button onClick={() => setTarget({ kind: 'new' })}>+ معادلة</button>
        {Object.entries(FIGURES).map(([k, f]) => <button key={k} onClick={() => add({ type: 'figure', ...f.defaults })}>+ {f.label}</button>)}
      </div>
      <MathModal open={!!target} initial={cur?.type === 'equation' ? cur.latex : ''} allowModeToggle={target?.kind === 'insert'} onSubmit={submit} onClose={() => setTarget(null)} />
    </div>
  );
}

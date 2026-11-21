import type { Exam, Block } from '@/lib/schema';
import { FIGURES } from '@/lib/figures/registry';
import { Equation, RichText } from './Tex';

function Blocks({ blocks }: { blocks: Block[] }) {
  const out: React.ReactNode[] = [];
  let i = 0;
  while (i < blocks.length) {
    const b = blocks[i];
    if (b.type === 'figure') {
      // figure sits beside the text blocks that follow it (like the original layout)
      const rest = blocks.slice(i + 1);
      out.push(<div className="figrow" key={i}><div className="txt"><Blocks blocks={rest} /></div><div className="fig">{FIGURES[b.template].render(b)}</div></div>);
      break;
    }
    out.push(b.type === 'text' ? <p key={i} className={b.bold ? 'q' : ''}><RichText text={b.text} /></p> : <Equation key={i} latex={b.latex} />);
    i++;
  }
  return <>{out}</>;
}

export function ExamPreview({ exam }: { exam: Exam }) {
  return (
    <div className="page" id="exam-preview">
      <div className="top"><div>{exam.header.rightLines.map((l, i) => <div key={i}>{l}</div>)}</div><div>{exam.header.leftLines.map((l, i) => <div key={i}>{l}</div>)}</div></div>
      <div className="title">{exam.title}</div>
      {exam.subtitle && <div className="sub">{exam.subtitle}</div>}
      {exam.sections.map((s) => (
        <section className="frame" key={s.id}><h2>{s.title}</h2><div className="in"><Blocks blocks={s.blocks} /></div></section>
      ))}
      <div className="foot"><span>{exam.footerRight}</span><span>{exam.footerLeft}</span></div>
    </div>
  );
}

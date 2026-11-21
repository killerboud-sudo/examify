import type { Exam, Block, Section } from '@/lib/schema';
import { FIGURES } from '@/lib/figures/registry';
import { fontStack } from '@/lib/fonts';
import { Equation, RichText } from './Tex';
import { IconCal, IconCalc, IconCap, IconClock, IconMap, IconSchool } from './Icons';

function Blocks({ blocks, navy }: { blocks: Block[]; navy: boolean }) {
  const out: React.ReactNode[] = [];
  for (let i = 0; i < blocks.length; i++) {
    const b = blocks[i];
    if (b.type === 'figure') {
      out.push(<div className="figrow" key={i}><div className="txt"><Blocks blocks={blocks.slice(i + 1)} navy={navy} /></div><div className="fig">{FIGURES[b.template].render(b)}</div></div>);
      break; // the rest of the exercise sits beside the figure
    }
    if (b.type === 'text') {
      const m = navy ? /^\s*(\d+)\s*[)\-.]\s*([\s\S]*)$/.exec(b.text) : null; // "1) ..." -> circled number
      out.push(m
        ? <p key={i} className={`qi ${b.bold ? 'q' : ''}`}><span className="num">{m[1]}</span><span><RichText text={m[2]} /></span></p>
        : <p key={i} className={b.bold ? 'q' : ''}><RichText text={b.text} /></p>);
    } else if (b.type === 'equation') out.push(<Equation key={i} latex={b.latex} />);
    else if (b.type === 'pagebreak') out.push(<div className="pagebreak" key={i} aria-hidden="true" />);
    else if (b.type === 'table') out.push(
      <table key={i} className={`tbl ${b.bordered ? 'bd' : ''}`} style={b.widths.length ? { tableLayout: 'fixed', width: '100%' } : undefined}>
        {b.widths.length > 0 && <colgroup>{b.widths.map((w, k) => <col key={k} style={{ width: `${w}%` }} />)}</colgroup>}
        <tbody>{b.rows.map((row, ri) => <tr key={ri}>{row.map((c, ci) => { const T = c.header ? 'th' : 'td'; return <T key={ci} colSpan={c.colspan} rowSpan={c.rowspan}><RichText text={c.text} /></T>; })}</tr>)}</tbody>
      </table>);
    else if (b.type === 'image' && b.src) out.push(<div className={`imgblk ${b.align} ${b.wrap ? 'wrap' : ''}`} key={i} style={{ width: `${b.width}%` }}><img src={b.src} alt="" /></div>);
  }
  return <>{out}</>;
}

function Header({ exam }: { exam: Exam }) {
  const h = exam.header;
  if (exam.templateId === 'classic') {
    return (<>
      <div className="top">
        <div><div>مديرية التربية لولاية: {h.directorate}</div><div>متوسطة: {h.school}</div><div>المستوى: {h.level}</div></div>
        <div><div>المدة: {h.duration}</div><div>يوم: {h.day}</div>{h.calculatorAllowed && <div>يُسمح استخدام الحاسبة</div>}</div>
      </div>
      <div className="title">{exam.title}</div>
      {exam.subtitle && <div className="sub">{exam.subtitle}</div>}
    </>);
  }
  return (
    <header className="nh">
      <div className="nh-top"><span><IconSchool /> متوسطة: {h.school}</span><span><IconMap /> مديرية التربية لولاية: {h.directorate}</span></div>
      <h1 className="nh-title">{exam.title}</h1>
      {exam.subtitle && <div className="sub">{exam.subtitle}</div>}
      <div className="nh-info">
        <div><div><IconClock /> المدة: {h.duration}</div>{h.calculatorAllowed && <div><IconCalc /> يُسمح استخدام الحاسبة</div>}</div>
        <div><div><IconCap /> المستوى: {h.level}</div><div><IconCal /> يوم: {h.day}</div></div>
      </div>
    </header>
  );
}

function Frame({ s, navy }: { s: Section; navy: boolean }) {
  const pts = s.points > 0 ? `${s.points} نقاط` : '';
  return navy ? (
    <section className="nframe">
      <div className="nhead"><span className="ln" /><i>◆</i><h2>{s.title}</h2><i>◆</i><span className="ln" />{pts && <b className="pts">{pts}</b>}</div>
      <div className="in"><Blocks blocks={s.blocks} navy /></div>
    </section>
  ) : (
    <section className="frame"><h2>{s.title}{pts && ` - ${pts}`}</h2><div className="in"><Blocks blocks={s.blocks} navy={false} /></div></section>
  );
}

export function ExamPreview({ exam }: { exam: Exam }) {
  const navy = exam.templateId !== 'classic';
  return (
    <div className={`page tpl-${navy ? 'navy' : 'classic'}`} id="exam-preview" style={{ fontFamily: fontStack(exam.fontFamily), fontSize: `${exam.fontSize}pt` }}>
      <Header exam={exam} />
      {exam.sections.map((s) => (<div key={s.id}><Frame s={s} navy={navy} />{s.breakAfter && <div className="pagebreak" aria-hidden="true" />}</div>))}
      {(exam.footerRight || exam.footerLeft) && <div className="foot"><span>{exam.footerRight}</span><span>{exam.footerLeft}</span></div>}
    </div>
  );
}

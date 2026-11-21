import katex from 'katex';

const render = (tex: string, display: boolean) =>
  katex.renderToString(tex, { displayMode: display, throwOnError: false, output: 'html' });

/** Arabic text with inline $...$ math (math is always LTR). */
export function RichText({ text }: { text: string }) {
  return <>{text.split(/(\$[^$]+\$)/g).filter(Boolean).map((p, i) =>
    p.startsWith('$') && p.endsWith('$')
      ? <span key={i} dir="ltr" className="m" dangerouslySetInnerHTML={{ __html: render(p.slice(1, -1), false) }} />
      : <span key={i}>{p}</span>)}</>;
}
export const Equation = ({ latex }: { latex: string }) =>
  <div className="eq" dir="ltr" dangerouslySetInnerHTML={{ __html: render(latex, true) }} />;

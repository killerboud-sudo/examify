export type Cell = { text: string; colspan: number; rowspan: number; header: boolean };
export type Rows = Cell[][];
type Grid = { g: number[][]; cells: Cell[] };
const empty = (): Cell => ({ text: '', colspan: 1, rowspan: 1, header: false });

/** HTML-style rows (colspan/rowspan) <-> a plain grid of cell ids. All edits work on the grid, so merges/splits stay consistent. */
function toGrid(rows: Rows): Grid {
  const g: number[][] = []; const cells: Cell[] = [];
  rows.forEach((row, r) => {
    g[r] = g[r] ?? []; let c = 0;
    row.forEach((cell) => {
      while (g[r][c] !== undefined) c++;
      const id = cells.push({ ...cell }) - 1; const cs = Math.max(1, cell.colspan), rs = Math.max(1, cell.rowspan);
      for (let i = 0; i < rs; i++) { g[r + i] = g[r + i] ?? []; for (let j = 0; j < cs; j++) g[r + i][c + j] = id; }
      c += cs;
    });
  });
  const w = Math.max(1, ...Array.from(g, (r) => (r ?? []).length));
  for (let r = 0; r < g.length; r++) { g[r] = g[r] ?? []; for (let c = 0; c < w; c++) if (g[r][c] === undefined) g[r][c] = cells.push(empty()) - 1; }
  return { g, cells };
}
const bbox = (g: number[][], id: number) => {
  let r0 = 1e9, r1 = -1, c0 = 1e9, c1 = -1;
  g.forEach((row, r) => row.forEach((v, c) => { if (v === id) { r0 = Math.min(r0, r); r1 = Math.max(r1, r); c0 = Math.min(c0, c); c1 = Math.max(c1, c); } }));
  return { r0, r1, c0, c1 };
};
function fromGrid({ g, cells }: Grid): Rows {
  const seen = new Set<number>();
  return g.map((row) => { const out: Cell[] = [];
    row.forEach((id) => { if (seen.has(id)) return; seen.add(id); const b = bbox(g, id); out.push({ ...cells[id], colspan: b.c1 - b.c0 + 1, rowspan: b.r1 - b.r0 + 1 }); });
    return out; });
}
export function layout(rows: Rows) {
  const { g, cells } = toGrid(rows); const seen = new Set<number>(); const anchors: { cell: Cell; r: number; c: number }[] = [];
  g.forEach((row, r) => row.forEach((id, c) => { if (!seen.has(id)) { seen.add(id); const b = bbox(g, id); anchors.push({ cell: { ...cells[id], colspan: b.c1 - b.c0 + 1, rowspan: b.r1 - b.r0 + 1 }, r, c }); } }));
  return { height: g.length, width: g[0]?.length ?? 0, anchors };
}
export const newTable = (r = 3, c = 3): Rows => Array.from({ length: r }, (_, i) => Array.from({ length: c }, () => ({ ...empty(), header: i === 0 })));

export const setText = (rows: Rows, r: number, c: number, text: string) => { const G = toGrid(rows); G.cells[G.g[r][c]].text = text; return fromGrid(G); };
export const toggleHeader = (rows: Rows, r: number, c: number) => { const G = toGrid(rows); const x = G.cells[G.g[r][c]]; x.header = !x.header; return fromGrid(G); };
export const addRow = (rows: Rows, r: number) => { const G = toGrid(rows); G.g.splice(r + 1, 0, G.g[r].map((id, c) => (G.g[r + 1]?.[c] === id ? id : G.cells.push(empty()) - 1))); return fromGrid(G); };
export const addCol = (rows: Rows, c: number) => { const G = toGrid(rows); G.g.forEach((row) => row.splice(c + 1, 0, row[c + 1] === row[c] ? row[c] : G.cells.push(empty()) - 1)); return fromGrid(G); };
export const delRow = (rows: Rows, r: number) => { const G = toGrid(rows); if (G.g.length <= 1) return rows; G.g.splice(r, 1); return fromGrid(G); };
export const delCol = (rows: Rows, c: number) => { const G = toGrid(rows); if (G.g[0].length <= 1) return rows; G.g.forEach((row) => row.splice(c, 1)); return fromGrid(G); };
function merge(rows: Rows, r: number, c: number, dir: 'right' | 'down') {
  const G = toGrid(rows); const id = G.g[r][c]; const b = bbox(G.g, id);
  const n = dir === 'right' ? G.g[b.r0]?.[b.c1 + 1] : G.g[b.r1 + 1]?.[b.c0];
  if (n === undefined) return rows;
  const bn = bbox(G.g, n);
  if (dir === 'right' ? bn.r0 !== b.r0 || bn.r1 !== b.r1 : bn.c0 !== b.c0 || bn.c1 !== b.c1) return rows;
  G.g = G.g.map((row) => row.map((v) => (v === n ? id : v)));
  G.cells[id].text = [G.cells[id].text, G.cells[n].text].filter(Boolean).join(' ');
  return fromGrid(G);
}
export const mergeRight = (rows: Rows, r: number, c: number) => merge(rows, r, c, 'right');
export const mergeDown = (rows: Rows, r: number, c: number) => merge(rows, r, c, 'down');
export const split = (rows: Rows, r: number, c: number) => {
  const G = toGrid(rows); const id = G.g[r][c]; const b = bbox(G.g, id);
  for (let i = b.r0; i <= b.r1; i++) for (let j = b.c0; j <= b.c1; j++) if (i !== b.r0 || j !== b.c0) G.g[i][j] = G.cells.push(empty()) - 1;
  return fromGrid(G);
};

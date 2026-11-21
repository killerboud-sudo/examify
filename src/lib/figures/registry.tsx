import type { ReactElement } from 'react';
import type { Block } from '../schema';

type Fig = Extract<Block, { type: 'figure' }>;

/** Add a figure template = add one entry (renderer + default values). */
export const FIGURES: Record<Fig['template'], { label: string; defaults: Omit<Fig, 'type'>; render: (f: Fig) => ReactElement }> = {
  'right-triangle': {
    label: 'مثلث قائم',
    defaults: { template: 'right-triangle', vertexRight: 'R', vertexBase: 'S', vertexTop: 'T', baseLabel: '3 cm', heightLabel: '4 cm' },
    render: (f) => (
      <svg viewBox="0 0 250 330" width="100%" direction="ltr" style={{ direction: 'ltr', unicodeBidi: 'isolate' }} role="img" aria-label="مثلث قائم">
        <polygon points="50,60 50,280 215,280" fill="#EAF1FB" stroke="#111827" strokeWidth="2.4" strokeLinejoin="round" />
        <path d="M50 266 H64 V280" fill="none" stroke="#111827" strokeWidth="2" />
        <g fontFamily="Amiri, serif" fontSize="22" fill="#111827">
          <text x="50" y="44" textAnchor="middle" fontStyle="italic" fontWeight="700" fill="#1F4E9C">{f.vertexTop}</text>
          <text x="30" y="302" textAnchor="middle" fontStyle="italic" fontWeight="700" fill="#1F4E9C">{f.vertexRight}</text>
          <text x="224" y="302" textAnchor="middle" fontStyle="italic" fontWeight="700" fill="#1F4E9C">{f.vertexBase}</text>
          <text x="8" y="176" textAnchor="middle" transform="rotate(-90 14 172)">{f.heightLabel}</text>
          <text x="132" y="310" textAnchor="middle">{f.baseLabel}</text>
        </g>
      </svg>
    ),
  },
};

const I = ({ d }: { d: React.ReactNode }) => (
  <svg className="ic" viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{d}</svg>
);
export const IconSchool = () => <I d={<><path d="M3 21V9l9-6 9 6v12" /><path d="M9 21v-6h6v6" /><path d="M12 9v3" /></>} />;
export const IconMap = () => <I d={<><path d="M9 4 3 6v14l6-2 6 2 6-2V4l-6 2z" /><path d="M9 4v14M15 6v14" /></>} />;
export const IconClock = () => <I d={<><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>} />;
export const IconCalc = () => <I d={<><rect x="5" y="3" width="14" height="18" rx="2" /><path d="M8 7h8M8 11h2M12 11h2M16 11h0M8 15h2M12 15h2M16 15h0" /></>} />;
export const IconCap = () => <I d={<><path d="M2 9 12 4l10 5-10 5z" /><path d="M6 11v5c3 2 9 2 12 0v-5" /></>} />;
export const IconCal = () => <I d={<><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M3 10h18M8 3v4M16 3v4" /></>} />;

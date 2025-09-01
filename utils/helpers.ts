export const round1 = (n: number) => Math.round(n * 10) / 10;
export const capitalize = (s?: string) =>
  s ? s.charAt(0).toUpperCase() + s.slice(1) : "";
export const humanize = (s?: string) =>
  s ? s.replace(/[-_]/g, " ").replace(/\b\w/g, (m) => m.toUpperCase()) : "";

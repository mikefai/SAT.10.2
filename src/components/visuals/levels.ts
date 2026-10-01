export type Level = 0 | 1 | 2 | 3;

export const toLevel = (n: number): Level => Math.max(0, Math.min(3, Math.trunc(n))) as Level;

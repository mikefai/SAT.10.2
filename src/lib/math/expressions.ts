import { formatNumber, MINUS } from "./numbers";

export type VarRole = "m" | "b" | "a" | "h" | "k" | "c";
export interface Token {
  text: string;
  role?: VarRole;
  italic?: boolean;
}

const v = (text: string): Token => ({ text, italic: true });
const op = (text: string): Token => ({ text });
const mag = (n: number, role: VarRole): Token => ({ text: formatNumber(Math.abs(n)), role });
const sign = (n: number): Token => op(n > 0 ? " + " : ` ${MINUS} `);
const lead = (n: number, role: VarRole): Token[] =>
  n === 1 ? [] : n === -1 ? [{ text: MINUS, role }] : [{ text: formatNumber(n), role }];

export function linearTokens(m: number, b: number): Token[] {
  const out: Token[] = [v("y"), op(" = ")];
  if (m === 0) return [...out, { text: formatNumber(b), role: "b" }];
  out.push(...lead(m, "m"), v("x"));
  if (b !== 0) out.push(sign(b), mag(b, "b"));
  return out;
}

export function vertexTokens(a: number, h: number, k: number): Token[] {
  const out: Token[] = [v("y"), op(" = ")];
  if (a === 0) return [...out, { text: formatNumber(k), role: "k" }];
  out.push(...lead(a, "a"));
  if (h === 0) out.push(v("x"), op("²"));
  else out.push(op("("), v("x"), op(h > 0 ? ` ${MINUS} ` : " + "), mag(h, "h"), op(")²"));
  if (k !== 0) out.push(sign(k), mag(k, "k"));
  return out;
}

export function standardQuadraticTokens(a: number, b: number, c: number): Token[] {
  const out: Token[] = [v("y"), op(" = "), ...lead(a, "a"), v("x"), op("²")];
  if (b !== 0) {
    out.push(sign(b));
    if (Math.abs(b) !== 1) out.push(mag(b, "b"));
    out.push(v("x"));
  }
  if (c !== 0) out.push(sign(c), mag(c, "c"));
  return out;
}

export const tokensToText = (tokens: Token[]): string => tokens.map((token) => token.text).join("");

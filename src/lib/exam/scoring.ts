import type { ExamBranch } from "@/content/exam/types";

// A transparent, practice-grade estimate of the official 200–800 Digital SAT Math
// scale. Real College Board scoring uses a proprietary item-response-theory curve
// that isn't public; this model keeps the two properties that ARE publicly known
// and matter for the student: (1) the harder Module 2 branch can reach the full
// 800 ceiling, while the easier branch caps well below it (routing to the easier
// module cannot earn a top score on the real test either), and (2) the curve is
// concave (each additional correct answer near the top is worth less than one
// near the bottom), which is the broad shape of real SAT scoring.
const CEILING_ABOVE_FLOOR: Record<ExamBranch, number> = { harder: 600, easier: 450 };
const FLOOR = 200;
const CURVE_EXPONENT = 0.85;

export function scaleScore(rawCorrect: number, rawTotal: number, branch: ExamBranch): number {
  if (rawTotal <= 0) return FLOOR;
  const ratio = Math.min(1, Math.max(0, rawCorrect / rawTotal));
  const raw = FLOOR + CEILING_ABOVE_FLOOR[branch] * ratio ** CURVE_EXPONENT;
  return Math.round(raw / 10) * 10;
}

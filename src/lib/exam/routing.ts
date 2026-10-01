import type { ExamBranch } from "@/content/exam/types";

// Approximates the real Digital SAT's multistage adaptive routing: performing well
// on Module 1 unlocks the harder Module 2 (and a higher score ceiling); performing
// less well routes to the easier Module 2. The real test's threshold is an
// item-response-theory ability estimate, not a raw percentage; this fixed 55%
// cut is a transparent, practice-grade approximation of that behavior.
const ROUTE_THRESHOLD_RATIO = 0.55;

export function routeModule2(correct: number, total: number): ExamBranch {
  if (total <= 0) return "easier";
  const threshold = Math.ceil(total * ROUTE_THRESHOLD_RATIO);
  return correct >= threshold ? "harder" : "easier";
}

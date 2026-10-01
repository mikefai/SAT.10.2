import { EXAM_DOMAINS, type DomainTally, type ExamDomain, type ExamQuestion } from "@/content/exam/types";
import { answersMatch, parseNumericAnswer } from "@/lib/math/parse";
import type { ExamResponse } from "@/lib/progress/types";

export function isCorrect(question: ExamQuestion, response: ExamResponse | undefined): boolean {
  if (!response) return false;
  if (question.type === "mc") return response.letter === question.correctLetter;
  if (response.text === undefined) return false;
  const value = parseNumericAnswer(response.text);
  return value !== null && answersMatch(value, question.correctValue);
}

export function countCorrect(questions: readonly ExamQuestion[], responses: Record<number, ExamResponse>): number {
  return questions.reduce((sum, q, i) => sum + (isCorrect(q, responses[i]) ? 1 : 0), 0);
}

const emptyTallies = (): Record<ExamDomain, DomainTally> =>
  Object.fromEntries(EXAM_DOMAINS.map((d) => [d, { correct: 0, total: 0 }])) as Record<ExamDomain, DomainTally>;

export function domainBreakdown(
  questions: readonly ExamQuestion[],
  responses: Record<number, ExamResponse>,
): Record<ExamDomain, DomainTally> {
  const tallies = emptyTallies();
  questions.forEach((q, i) => {
    tallies[q.domain].total += 1;
    if (isCorrect(q, responses[i])) tallies[q.domain].correct += 1;
  });
  return tallies;
}

export function mergeDomainTallies(
  a: Record<ExamDomain, DomainTally>,
  b: Record<ExamDomain, DomainTally>,
): Record<ExamDomain, DomainTally> {
  const out = emptyTallies();
  for (const d of EXAM_DOMAINS) out[d] = { correct: a[d].correct + b[d].correct, total: a[d].total + b[d].total };
  return out;
}

"use client";
import { ArrowRight, Target } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Callout } from "@/components/ui/Callout";
import { Card } from "@/components/ui/Card";
import { Pill } from "@/components/ui/Pill";
import { EXAM_DOMAIN_LABEL, EXAM_DOMAINS } from "@/content/exam/types";
import type { ExamQuestion } from "@/content/exam/types";
import { EXAM_MODULE_1 } from "@/content/exam/module1";
import { EXAM_MODULE_2_EASIER } from "@/content/exam/module2-easier";
import { EXAM_MODULE_2_HARDER } from "@/content/exam/module2-harder";
import { isCorrect } from "@/lib/exam/grading";
import type { ExamResponse, ExamState } from "@/lib/progress/types";
import { useProgress } from "@/lib/progress/use-progress";
import type { Tab } from "@/lib/tabs";

export function ScoreReport({ exam, onNavigate }: { exam: ExamState; onNavigate: (tab: Tab) => void }) {
  const [, dispatch] = useProgress();
  const result = exam.result;
  if (!result) return null;
  const module2Questions = result.module2Branch === "harder" ? EXAM_MODULE_2_HARDER : EXAM_MODULE_2_EASIER;

  const weakest = EXAM_DOMAINS.map((d) => ({ domain: d, ...result.byDomain[d] }))
    .filter((d) => d.total > 0)
    .sort((a, b) => a.correct / a.total - b.correct / b.total)[0];

  return (
    <div className="space-y-6">
      <Card className="space-y-2 text-center">
        <p className="text-sm font-semibold uppercase tracking-wide text-muted">Estimated Math score</p>
        <p className="text-6xl font-bold tracking-tight text-accent">{result.scaledScore}</p>
        <p className="text-muted">
          {result.rawCorrect} of {result.rawTotal} correct · routed to the {result.module2Branch} Module 2
        </p>
        <p className="text-xs text-muted">
          A practice estimate — real College Board scoring uses a proprietary curve.
          {result.module2Branch === "easier" && " Score higher on Module 1 next time to unlock the full 200–800 range."}
        </p>
      </Card>

      <section aria-labelledby="domains-heading">
        <h2 id="domains-heading" className="mb-3 text-xl font-semibold">
          By skill area
        </h2>
        <div className="space-y-3">
          {EXAM_DOMAINS.map((d) => {
            const tally = result.byDomain[d];
            const pct = tally.total > 0 ? Math.round((tally.correct / tally.total) * 100) : 0;
            return (
              <div key={d}>
                <div className="mb-1 flex justify-between text-sm font-medium">
                  <span>{EXAM_DOMAIN_LABEL[d]}</span>
                  <span>
                    {tally.correct}/{tally.total}
                  </span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-surface-2">
                  <div className="h-full rounded-full bg-accent-solid" style={{ width: `${pct}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {weakest && weakest.total > 0 && (
        <Callout tone="info" icon={Target} title="Focus next">
          <p className="mb-3">
            {EXAM_DOMAIN_LABEL[weakest.domain]} was your toughest area ({weakest.correct} of {weakest.total}). Build it
            back up with the Trap Decoder and Formula Anchors before your next attempt.
          </p>
          <Button onClick={() => onNavigate("decoder")}>
            Go to Trap Decoder
            <ArrowRight aria-hidden="true" className="size-4" />
          </Button>
        </Callout>
      )}

      <section aria-labelledby="review-heading">
        <h2 id="review-heading" className="mb-3 text-xl font-semibold">
          Review every question
        </h2>
        <div className="space-y-6">
          <QuestionReviewList title="Module 1" questions={EXAM_MODULE_1} responses={exam.module1Responses} />
          <QuestionReviewList title={`Module 2 (${result.module2Branch})`} questions={module2Questions} responses={exam.module2Responses} />
        </div>
      </section>

      <div className="flex justify-center">
        <Button variant="secondary" onClick={() => dispatch({ type: "exam/start" })}>
          Start a new attempt
        </Button>
      </div>
    </div>
  );
}

function QuestionReviewList({
  title,
  questions,
  responses,
}: {
  title: string;
  questions: ExamQuestion[];
  responses: Record<number, ExamResponse>;
}) {
  return (
    <div>
      <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-muted">{title}</p>
      <ol className="space-y-2">
        {questions.map((q, i) => {
          const correct = isCorrect(q, responses[i]);
          return (
            <li key={q.id}>
              <details className="rounded-xl border border-line bg-surface p-3">
                <summary className="flex min-h-8 cursor-pointer items-center gap-2 font-medium">
                  <Pill tone={correct ? "ok" : "trap"}>{correct ? "Correct" : "Review"}</Pill>
                  Question {i + 1}
                </summary>
                <div className="mt-3 space-y-2 text-base">
                  <div>{q.prompt}</div>
                  <p className="text-sm text-muted">{q.explanation}</p>
                </div>
              </details>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

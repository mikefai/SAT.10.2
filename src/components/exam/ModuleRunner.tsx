"use client";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Callout } from "@/components/ui/Callout";
import type { ExamQuestion } from "@/content/exam/types";
import { MODULE_SIZE } from "@/content/exam/types";
import type { ChoiceLetter, ExamState } from "@/lib/progress/types";
import { useProgress } from "@/lib/progress/use-progress";
import { ExamQuestionCard } from "./ExamQuestionCard";
import { ExamTimer } from "./ExamTimer";
import { QuestionNav } from "./QuestionNav";

export function ModuleRunner({
  moduleNumber,
  questions,
  exam,
  onSubmit,
}: {
  moduleNumber: 1 | 2;
  questions: ExamQuestion[];
  exam: ExamState;
  onSubmit: () => void;
}) {
  const [, dispatch] = useProgress();
  const [confirmingSubmit, setConfirmingSubmit] = useState(false);
  const responses = moduleNumber === 1 ? exam.module1Responses : exam.module2Responses;
  const flags = moduleNumber === 1 ? exam.module1Flags : exam.module2Flags;
  const cursor = exam.cursor;
  const question = questions[cursor];
  const answeredCount = Object.keys(responses).length;
  const unanswered = MODULE_SIZE - answeredCount;

  if (!exam.deadline) return null; // defensive: a timed module always has a deadline

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-line bg-surface-2 px-4 py-2">
        <span className="font-semibold">
          Module {moduleNumber} · {answeredCount} of {MODULE_SIZE} answered
        </span>
        <ExamTimer deadline={exam.deadline} onExpire={onSubmit} />
      </div>

      <ExamQuestionCard
        key={question.id}
        question={question}
        index={cursor}
        total={MODULE_SIZE}
        response={responses[cursor]}
        flagged={flags.includes(cursor)}
        onAnswerMc={(letter: ChoiceLetter) => dispatch({ type: "exam/answerMc", index: cursor, letter })}
        onAnswerSpr={(text: string) => dispatch({ type: "exam/answerSpr", index: cursor, text })}
        onToggleFlag={() => dispatch({ type: "exam/toggleFlag", index: cursor })}
      />

      <div className="flex flex-wrap items-center justify-between gap-2">
        <Button variant="secondary" disabled={cursor === 0} onClick={() => dispatch({ type: "exam/goTo", index: cursor - 1 })}>
          Previous
        </Button>
        <div className="flex gap-2">
          <Button variant="ghost" onClick={() => setConfirmingSubmit(true)}>
            Review &amp; submit
          </Button>
          <Button disabled={cursor === MODULE_SIZE - 1} onClick={() => dispatch({ type: "exam/goTo", index: cursor + 1 })}>
            Next
          </Button>
        </div>
      </div>

      <QuestionNav
        total={MODULE_SIZE}
        responses={responses}
        flags={flags}
        current={cursor}
        onGoTo={(i) => dispatch({ type: "exam/goTo", index: i })}
      />

      {confirmingSubmit && (
        <Callout tone="info" title={`Submit Module ${moduleNumber}?`}>
          <p className="mb-3">
            {unanswered > 0 && `${unanswered} question${unanswered === 1 ? " is" : "s are"} still unanswered. `}
            {moduleNumber === 1 ? "You can’t return to Module 1 once you submit." : "This finishes the exam and shows your score."}
          </p>
          <div className="flex flex-wrap gap-2">
            <Button variant="secondary" onClick={() => setConfirmingSubmit(false)}>
              Keep working
            </Button>
            <Button onClick={onSubmit}>Submit Module {moduleNumber}</Button>
          </div>
        </Callout>
      )}
    </div>
  );
}

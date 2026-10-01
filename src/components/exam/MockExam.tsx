"use client";
import type { Ref } from "react";
import { ViewHeader } from "@/components/shell/ViewHeader";
import { EXAM_MODULE_1 } from "@/content/exam/module1";
import { EXAM_MODULE_2_EASIER } from "@/content/exam/module2-easier";
import { EXAM_MODULE_2_HARDER } from "@/content/exam/module2-harder";
import { countCorrect, domainBreakdown, mergeDomainTallies } from "@/lib/exam/grading";
import { useProgress } from "@/lib/progress/use-progress";
import type { Tab } from "@/lib/tabs";
import { BetweenModules } from "./BetweenModules";
import { ExamIntro } from "./ExamIntro";
import { ModuleRunner } from "./ModuleRunner";
import { ScoreReport } from "./ScoreReport";

export function MockExam({ headingRef, onNavigate }: { headingRef: Ref<HTMLHeadingElement>; onNavigate: (tab: Tab) => void }) {
  const [state, dispatch] = useProgress();
  const exam = state.exam;

  return (
    <div className="space-y-5">
      <ViewHeader
        title="Mock Exam"
        intro="A full-length, adaptive Math practice test: the same two-module structure, timing, and scoring shape as the real Digital SAT."
        headingRef={headingRef}
      />

      {!exam && <ExamIntro />}

      {exam && exam.phase === "module1" && (
        <ModuleRunner
          key="module1"
          moduleNumber={1}
          questions={EXAM_MODULE_1}
          exam={exam}
          onSubmit={() => dispatch({ type: "exam/submitModule1", correct: countCorrect(EXAM_MODULE_1, exam.module1Responses) })}
        />
      )}

      {exam && exam.phase === "between" && <BetweenModules />}

      {exam && exam.phase === "module2" && exam.module2Branch && (
        <ModuleRunner
          key="module2"
          moduleNumber={2}
          questions={exam.module2Branch === "harder" ? EXAM_MODULE_2_HARDER : EXAM_MODULE_2_EASIER}
          exam={exam}
          onSubmit={() => {
            const module2Questions = exam.module2Branch === "harder" ? EXAM_MODULE_2_HARDER : EXAM_MODULE_2_EASIER;
            const correct = countCorrect(module2Questions, exam.module2Responses);
            const byDomain = mergeDomainTallies(
              domainBreakdown(EXAM_MODULE_1, exam.module1Responses),
              domainBreakdown(module2Questions, exam.module2Responses),
            );
            dispatch({ type: "exam/submitModule2", correct, byDomain });
          }}
        />
      )}

      {exam && exam.phase === "report" && <ScoreReport exam={exam} onNavigate={onNavigate} />}
    </div>
  );
}

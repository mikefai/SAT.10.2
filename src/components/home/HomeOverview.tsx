"use client";
import { ClipboardList, Copy, ScanSearch, SlidersHorizontal } from "lucide-react";
import type { Ref } from "react";
import { ViewHeader } from "@/components/shell/ViewHeader";
import { ANCHORS } from "@/content/anchors";
import { DECODER_QUESTIONS } from "@/content/decoder";
import { TWIN_SETS } from "@/content/twins";
import { anchorStats, decoderStats, overallProgress, twinStats } from "@/lib/progress/selectors";
import { useProgress } from "@/lib/progress/use-progress";
import type { Tab } from "@/lib/tabs";
import { ModuleCard } from "./ModuleCard";
import { ResetProgress } from "./ResetProgress";
import { TrapJournal } from "./TrapJournal";

export function HomeOverview({
  headingRef,
  onNavigate,
}: {
  headingRef: Ref<HTMLHeadingElement>;
  onNavigate: (tab: Tab) => void;
}) {
  const [state] = useProgress();
  const decoder = decoderStats(state, DECODER_QUESTIONS);
  const twins = twinStats(state, TWIN_SETS);
  const anchors = anchorStats(state, ANCHORS);
  const overall = Math.round(overallProgress(state, { questions: DECODER_QUESTIONS, sets: TWIN_SETS, anchors: ANCHORS }) * 100);
  const exam = state.exam;
  const examProgressText = !exam
    ? "Not started yet"
    : exam.phase === "report"
      ? `Last score: ${exam.result?.scaledScore ?? "—"}`
      : "In progress";
  const examFraction = !exam ? 0 : exam.phase === "report" ? 1 : 0.5;

  return (
    <div className="space-y-10">
      <div>
        <ViewHeader
          title="SAT Math, one small step at a time."
          intro="Three tools. No timers. Wrong answers are clues, not failures."
          headingRef={headingRef}
        />
        <div className="max-w-md">
          <div className="mb-1 flex justify-between text-sm font-medium">
            <span>Your progress</span>
            <span>{overall}%</span>
          </div>
          <div
            role="progressbar"
            aria-label="Overall progress"
            aria-valuenow={overall}
            aria-valuemin={0}
            aria-valuemax={100}
            className="h-3 overflow-hidden rounded-full bg-surface-2"
          >
            <div className="h-full rounded-full bg-accent-solid transition-all" style={{ width: `${overall}%` }} />
          </div>
        </div>
      </div>

      <section aria-labelledby="path-heading">
        <h2 id="path-heading" className="mb-3 text-2xl font-semibold tracking-tight">
          Your path
        </h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <ModuleCard
            step={1}
            icon={ScanSearch}
            title="Trap Decoder"
            description="Spot the exact slip behind each wrong answer."
            progressText={`${decoder.solved} of ${decoder.total} decoded`}
            fraction={decoder.solved / decoder.total}
            onOpen={() => onNavigate("decoder")}
          />
          <ModuleCard
            step={2}
            icon={Copy}
            title="Twin Drill"
            description="Study a solved problem, then solve its twin."
            progressText={`${twins.completed} of ${twins.total} twins solved`}
            fraction={twins.completed / twins.total}
            onOpen={() => onNavigate("twins")}
          />
          <ModuleCard
            step={3}
            icon={SlidersHorizontal}
            title="Formula Anchors"
            description="Move sliders and watch the formula come alive."
            progressText={`${anchors.explored} of ${anchors.total} explored`}
            fraction={anchors.explored / anchors.total}
            onOpen={() => onNavigate("anchors")}
          />
          <ModuleCard
            step={4}
            icon={ClipboardList}
            title="Mock Exam"
            description="A full adaptive practice test, start to finish."
            progressText={examProgressText}
            fraction={examFraction}
            onOpen={() => onNavigate("exam")}
          />
        </div>
      </section>

      <TrapJournal onNavigate={onNavigate} />
      <ResetProgress />
    </div>
  );
}

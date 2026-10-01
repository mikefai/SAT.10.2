import { VisualAnchor } from "@/components/visuals/VisualAnchor";
import { DECODER_QUESTIONS } from "@/content/decoder";
import { TWIN_SETS } from "@/content/twins";
import type { VisualSpec } from "@/content/types";

// Temporary visual gallery (replaced in Task 7).
const ENTRIES: { name: string; spec: VisualSpec }[] = [
  ...DECODER_QUESTIONS.map((q) => ({ name: q.id, spec: q.visual })),
  ...TWIN_SETS.flatMap((s) => [
    { name: `${s.id} sample`, spec: s.sample.visual },
    { name: `${s.id} twin`, spec: s.twin.visual },
  ]),
];

export default function Page() {
  return (
    <main className="mx-auto max-w-6xl space-y-8 p-6">
      {ENTRIES.map((entry) => (
        <section key={entry.name}>
          <h2 className="mb-2 font-semibold">{entry.name}</h2>
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {[0, 1, 2, 3].map((level) => (
              <div key={level} className="rounded-xl border border-line bg-surface p-3">
                <p className="mb-1 text-xs text-muted">level {level}</p>
                <VisualAnchor spec={entry.spec} level={level} />
              </div>
            ))}
          </div>
        </section>
      ))}
    </main>
  );
}

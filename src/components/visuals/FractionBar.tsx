import type { VisualSpec } from "@/content/types";
import type { Level } from "./levels";

type Props = Omit<Extract<VisualSpec, { kind: "fraction-bar" }>, "kind"> & { level: Level };

export function FractionBar({ parts, partValue, prefix, highlight, extra = 0, caption, level }: Props) {
  const total = parts * partValue;
  const description =
    `A bar worth ${prefix}${total}, split into ${parts} equal parts of ${prefix}${partValue}.` +
    (highlight > 0 ? ` ${highlight} part${highlight > 1 ? "s are" : " is"} highlighted.` : "") +
    (extra > 0 ? ` ${extra} extra part${extra > 1 ? "s" : ""} of ${prefix}${partValue} sit${extra > 1 ? "" : "s"} beside it.` : "");

  return (
    <figure className="w-full">
      <div className="flex items-stretch gap-2" role="img" aria-label={description}>
        <div className="flex flex-1 overflow-hidden rounded-xl border-2 border-line" aria-hidden="true">
          {level === 0 ? (
            <div className="flex-1 bg-accent-soft px-2 py-4 text-center font-semibold text-accent">
              {prefix}
              {total}
            </div>
          ) : (
            Array.from({ length: parts }, (_, i) => {
              const hot = level >= 2 && i < highlight;
              return (
                <div
                  key={i}
                  className={`flex-1 border-l border-line px-1 py-4 text-center text-sm font-semibold first:border-l-0 ${
                    hot ? "bg-trap-soft text-trap" : "bg-accent-soft text-accent"
                  }`}
                >
                  {prefix}
                  {partValue}
                </div>
              );
            })
          )}
        </div>
        {level >= 2 && extra > 0 && (
          <>
            <span aria-hidden="true" className="self-center text-lg font-bold text-trap">
              +
            </span>
            <div className="flex overflow-hidden rounded-xl border-2 border-trap-line" aria-hidden="true">
              {Array.from({ length: extra }, (_, i) => (
                <div key={i} className="bg-trap-soft px-3 py-4 text-center text-sm font-semibold text-trap">
                  {prefix}
                  {partValue}
                </div>
              ))}
            </div>
          </>
        )}
      </div>
      {level >= 3 && <figcaption className="mt-2 text-center text-sm text-muted">{caption}</figcaption>}
    </figure>
  );
}

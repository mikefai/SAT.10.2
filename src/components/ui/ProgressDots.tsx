export function ProgressDots({
  total,
  current,
  done,
  label,
  onSelect,
}: {
  total: number;
  current: number;
  done: boolean[];
  label: (index: number) => string;
  onSelect?: (index: number) => void;
}) {
  return (
    <div className="flex items-center gap-2">
      {Array.from({ length: total }, (_, i) => {
        const cls = `size-4 rounded-full border-2 border-accent transition ${done[i] ? "bg-accent-solid" : "bg-transparent"} ${
          i === current ? "ring-2 ring-accent ring-offset-2 ring-offset-bg" : ""
        }`;
        return onSelect ? (
          <button
            key={i}
            type="button"
            aria-label={label(i)}
            aria-current={i === current ? "step" : undefined}
            onClick={() => onSelect(i)}
            className="flex size-11 items-center justify-center"
          >
            <span className={cls} />
          </button>
        ) : (
          <span key={i} role="img" aria-label={label(i)} className={cls} />
        );
      })}
      <span className="ml-1 text-sm text-muted">
        {Math.min(current + 1, total)} of {total}
      </span>
    </div>
  );
}

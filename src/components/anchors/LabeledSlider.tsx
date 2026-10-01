import { Minus, Plus } from "lucide-react";
import { formatNumber } from "@/lib/math/numbers";

export function LabeledSlider({
  id,
  symbol,
  name,
  colorClass,
  values,
  value,
  onChange,
}: {
  id: string;
  symbol: string;
  name: string;
  colorClass: string;
  values: readonly number[];
  value: number;
  onChange: (value: number) => void;
}) {
  const index = Math.max(0, values.indexOf(value));
  const move = (i: number) => onChange(values[Math.min(values.length - 1, Math.max(0, i))]);
  const stepper = "flex size-11 shrink-0 items-center justify-center rounded-xl border border-line bg-surface hover:bg-surface-2 disabled:opacity-40";
  return (
    <div className="rounded-xl border border-line bg-surface p-3">
      <div className="flex items-center justify-between gap-3">
        <label htmlFor={id} className="flex items-center gap-2">
          <span className={`flex size-8 items-center justify-center rounded-lg bg-surface-2 font-math text-xl italic font-semibold ${colorClass}`}>
            {symbol}
          </span>
          <span className="text-sm text-muted">{name}</span>
        </label>
        <output htmlFor={id} className="font-math text-xl font-semibold">
          {formatNumber(value)}
        </output>
      </div>
      <div className="mt-2 flex items-center gap-2">
        <button type="button" aria-label={`Decrease ${symbol}`} disabled={index === 0} onClick={() => move(index - 1)} className={stepper}>
          <Minus aria-hidden="true" className="size-4" />
        </button>
        <input
          id={id}
          type="range"
          min={0}
          max={values.length - 1}
          step={1}
          value={index}
          aria-valuetext={`${symbol} = ${formatNumber(value)}`}
          onChange={(event) => move(Number(event.target.value))}
          className="h-11 w-full accent-accent"
        />
        <button
          type="button"
          aria-label={`Increase ${symbol}`}
          disabled={index === values.length - 1}
          onClick={() => move(index + 1)}
          className={stepper}
        >
          <Plus aria-hidden="true" className="size-4" />
        </button>
      </div>
    </div>
  );
}

"use client";
import { Eye, EyeOff } from "lucide-react";
import { useEffect, useRef, useState } from "react";

function formatRemaining(ms: number): string {
  const totalSeconds = Math.max(0, Math.ceil(ms / 1000));
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

export function ExamTimer({ deadline, onExpire }: { deadline: number; onExpire: () => void }) {
  const [remaining, setRemaining] = useState(() => deadline - Date.now());
  const [hidden, setHidden] = useState(false);
  const firedRef = useRef(false);
  // onExpire is read through a ref so the interval never needs to restart when the
  // caller passes a fresh closure each render — only a real deadline change does.
  // The ref is updated in its own effect (not during render) to satisfy the rule
  // against mutating refs while rendering.
  const onExpireRef = useRef(onExpire);
  useEffect(() => {
    onExpireRef.current = onExpire;
  });

  useEffect(() => {
    firedRef.current = false;
    const tick = () => {
      const next = deadline - Date.now();
      setRemaining(next);
      if (next <= 0 && !firedRef.current) {
        firedRef.current = true;
        onExpireRef.current();
      }
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [deadline]);

  const minutesLeft = remaining / 60_000;
  const urgent = minutesLeft <= 1;
  const warning = minutesLeft <= 5;
  const tone = urgent ? "font-bold text-trap" : warning ? "font-semibold text-trap" : "font-semibold";

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={() => setHidden((h) => !h)}
        aria-label={hidden ? "Show timer" : "Hide timer"}
        className="flex size-9 items-center justify-center rounded-lg text-muted hover:bg-surface"
      >
        {hidden ? <Eye aria-hidden="true" className="size-4" /> : <EyeOff aria-hidden="true" className="size-4" />}
      </button>
      <span className={`tabular-nums ${tone}`} aria-live={warning ? "polite" : "off"}>
        {hidden ? "Timer hidden" : formatRemaining(remaining)}
      </span>
    </div>
  );
}

import type { ReactNode } from "react";

export function Expr({ children, block = false }: { children: ReactNode; block?: boolean }) {
  return (
    <span className={block ? "my-2 block overflow-x-auto text-center font-math text-xl" : "font-math"}>{children}</span>
  );
}

export function V({ children }: { children: ReactNode }) {
  return <i className="font-math italic">{children}</i>;
}

export function Frac({ n, d }: { n: ReactNode; d: ReactNode }) {
  return (
    <span className="inline-block align-middle font-math">
      <span aria-hidden="true" className="inline-flex flex-col items-center text-[0.85em] leading-tight">
        <span className="px-1">{n}</span>
        <span className="border-t border-current px-1">{d}</span>
      </span>
      <span className="sr-only">
        {n} over {d}
      </span>
    </span>
  );
}

export function Sqrt({ children }: { children: ReactNode }) {
  return (
    <span className="font-math">
      <span aria-hidden="true">
        √<span className="border-t border-current">{children}</span>
      </span>
      <span className="sr-only">square root of {children}</span>
    </span>
  );
}

export function System({ lines }: { lines: string[] }) {
  return (
    <span className="my-2 flex items-center justify-center gap-2 font-math text-xl">
      <span aria-hidden="true" className="text-5xl font-light leading-none text-muted">
        {"{"}
      </span>
      <span className="flex flex-col">
        {lines.map((line) => (
          <span key={line}>{eq(line)}</span>
        ))}
      </span>
      <span className="sr-only">system: {lines.join(" and ")}</span>
    </span>
  );
}

// Only pure math goes through eq(): single a–z letters become italic variables.
export function eq(text: string, block = false) {
  return <Expr block={block}>{text.split(/([a-z])/).map((part, i) => (i % 2 ? <V key={i}>{part}</V> : part))}</Expr>;
}

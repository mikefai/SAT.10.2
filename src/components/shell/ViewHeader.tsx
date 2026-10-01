import type { ReactNode, Ref } from "react";

export function ViewHeader({
  title,
  intro,
  headingRef,
}: {
  title: string;
  intro: ReactNode;
  headingRef: Ref<HTMLHeadingElement>;
}) {
  return (
    <header className="mb-6">
      <h1 ref={headingRef} tabIndex={-1} className="text-3xl font-semibold tracking-tight outline-none sm:text-4xl">
        {title}
      </h1>
      <p className="mt-2 max-w-[65ch] text-lg text-muted">{intro}</p>
    </header>
  );
}

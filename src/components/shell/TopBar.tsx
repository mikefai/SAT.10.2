import type { Tab } from "@/lib/tabs";
import { NAV_ITEMS } from "./nav-items";
import { ThemeToggle } from "./ThemeToggle";

export function TopBar({ tab, onNavigate }: { tab: Tab; onNavigate: (tab: Tab) => void }) {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-bg/85 backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-5xl items-center gap-4 px-4 sm:px-6">
        <button
          type="button"
          onClick={() => onNavigate("home")}
          className="flex items-center gap-2 rounded-xl py-1 pr-2 text-left"
          aria-label="Math Lab home"
        >
          <span aria-hidden="true" className="flex size-9 items-center justify-center rounded-xl bg-accent-solid text-on-accent">
            ◆
          </span>
          <span className="whitespace-nowrap text-lg font-semibold tracking-tight">Math Lab</span>
          <span className="hidden rounded-full bg-surface-2 px-2 py-0.5 text-xs font-semibold text-muted sm:inline-block">OCT1.2</span>
        </button>
        <nav aria-label="Primary" className="ml-auto hidden items-center gap-1 md:flex">
          {NAV_ITEMS.map(({ tab: id, label, icon: Icon }) => {
            const active = id === tab;
            return (
              <button
                key={id}
                type="button"
                onClick={() => onNavigate(id)}
                aria-current={active ? "page" : undefined}
                className={`flex min-h-11 items-center gap-2 rounded-xl px-3 font-medium transition ${
                  active ? "bg-accent-soft text-accent" : "text-muted hover:bg-surface-2 hover:text-ink"
                }`}
              >
                <Icon aria-hidden="true" className="size-5" />
                {label}
              </button>
            );
          })}
        </nav>
        <div className="ml-auto md:ml-0">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}

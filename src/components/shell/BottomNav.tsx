import type { Tab } from "@/lib/tabs";
import { NAV_ITEMS } from "./nav-items";

export function BottomNav({ tab, onNavigate }: { tab: Tab; onNavigate: (tab: Tab) => void }) {
  return (
    <nav
      aria-label="Primary"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-surface pb-[env(safe-area-inset-bottom)] md:hidden"
    >
      <ul className="grid grid-cols-4">
        {NAV_ITEMS.map(({ tab: id, short, icon: Icon }) => {
          const active = id === tab;
          return (
            <li key={id}>
              <button
                type="button"
                onClick={() => onNavigate(id)}
                aria-current={active ? "page" : undefined}
                className={`flex min-h-14 w-full flex-col items-center justify-center gap-0.5 text-xs font-medium ${
                  active ? "text-accent" : "text-muted"
                }`}
              >
                <Icon aria-hidden="true" className="size-5" />
                {short}
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

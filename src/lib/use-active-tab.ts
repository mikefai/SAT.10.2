"use client";
import { useSyncExternalStore } from "react";
import { parseTab, type Tab } from "./tabs";

function subscribe(listener: () => void) {
  window.addEventListener("hashchange", listener);
  return () => window.removeEventListener("hashchange", listener);
}

export function useActiveTab(): [Tab, (tab: Tab) => void] {
  const tab = useSyncExternalStore(
    subscribe,
    () => parseTab(window.location.hash),
    () => "home" as const,
  );
  return [
    tab,
    (next) => {
      if (next !== tab) window.location.hash = next; // a new history entry, so Back works
    },
  ];
}

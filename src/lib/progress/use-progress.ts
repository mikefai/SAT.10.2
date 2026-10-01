"use client";
import { useSyncExternalStore } from "react";
import { createProgressStore, PROGRESS_KEY, type StorageLike } from "./store";
import type { ProgressAction, ProgressState } from "./types";

function browserStorage(): StorageLike | null {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

export const progressStore = createProgressStore(browserStorage());

if (typeof window !== "undefined") {
  window.addEventListener("storage", (event) => {
    if (event.key === PROGRESS_KEY) progressStore.syncFromStorage(event.newValue);
  });
}

export function useProgress(): [ProgressState, (action: ProgressAction) => void] {
  const state = useSyncExternalStore(progressStore.subscribe, progressStore.getSnapshot, progressStore.getServerSnapshot);
  return [state, progressStore.dispatch];
}

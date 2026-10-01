"use client";
import { useSyncExternalStore } from "react";
import { resolveTheme, THEME_KEY, type Theme } from "./theme";

const listeners = new Set<() => void>();
const emit = () => listeners.forEach((listener) => listener());
const read = (): Theme => (document.documentElement.classList.contains("dark") ? "dark" : "light");

function apply(theme: Theme) {
  const root = document.documentElement;
  root.classList.toggle("dark", theme === "dark");
  root.style.colorScheme = theme;
}

function storedTheme(): string | null {
  try {
    return localStorage.getItem(THEME_KEY);
  } catch {
    return null;
  }
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  const media = window.matchMedia("(prefers-color-scheme: dark)");
  const onSystemChange = () => {
    if (storedTheme() !== null) return; // an explicit choice wins
    apply(resolveTheme(null, media.matches));
    emit();
  };
  media.addEventListener("change", onSystemChange);
  return () => {
    listeners.delete(listener);
    media.removeEventListener("change", onSystemChange);
  };
}

export function setTheme(theme: Theme) {
  apply(theme);
  try {
    localStorage.setItem(THEME_KEY, theme);
  } catch {
    /* storage blocked: theme still applies this session */
  }
  emit();
}

export function useTheme(): [Theme, () => void] {
  const theme = useSyncExternalStore(subscribe, read, () => "light" as const);
  return [theme, () => setTheme(theme === "dark" ? "light" : "dark")];
}

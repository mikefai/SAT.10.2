export const TABS = ["home", "decoder", "twins", "anchors"] as const;
export type Tab = (typeof TABS)[number];

export function parseTab(hash: string): Tab {
  const id = hash.replace(/^#/, "");
  return (TABS as readonly string[]).includes(id) ? (id as Tab) : "home";
}

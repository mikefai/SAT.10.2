import { Copy, House, ScanSearch, SlidersHorizontal, type LucideIcon } from "lucide-react";
import type { Tab } from "@/lib/tabs";

export const NAV_ITEMS: { tab: Tab; label: string; short: string; icon: LucideIcon }[] = [
  { tab: "home", label: "Home", short: "Home", icon: House },
  { tab: "decoder", label: "Trap Decoder", short: "Decoder", icon: ScanSearch },
  { tab: "twins", label: "Twin Drill", short: "Twins", icon: Copy },
  { tab: "anchors", label: "Formula Anchors", short: "Anchors", icon: SlidersHorizontal },
];

"use client";
import { useEffect, useRef } from "react";
import { FormulaAnchors } from "@/components/anchors/FormulaAnchors";
import { TrapDecoder } from "@/components/decoder/TrapDecoder";
import { HomeOverview } from "@/components/home/HomeOverview";
import { TwinDrill } from "@/components/twins/TwinDrill";
import { useActiveTab } from "@/lib/use-active-tab";
import { BottomNav } from "./BottomNav";
import { SiteFooter } from "./SiteFooter";
import { TopBar } from "./TopBar";

export function MathLabApp() {
  const [tab, navigate] = useActiveTab();
  const headingRef = useRef<HTMLHeadingElement>(null);

  // Move focus to the new view's heading on real navigation (nav clicks and Back/Forward),
  // but never on first load: hashchange only fires after the page has loaded.
  useEffect(() => {
    const onHashChange = () => {
      window.scrollTo({ top: 0 });
      setTimeout(() => headingRef.current?.focus(), 0); // after React commits the new view
    };
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  return (
    <>
      <TopBar tab={tab} onNavigate={navigate} />
      <main id="main" className="mx-auto w-full max-w-5xl px-4 pb-28 pt-6 sm:px-6 md:pb-12">
        {tab === "home" && <HomeOverview headingRef={headingRef} onNavigate={navigate} />}
        {tab === "decoder" && <TrapDecoder headingRef={headingRef} />}
        {tab === "twins" && <TwinDrill headingRef={headingRef} />}
        {tab === "anchors" && <FormulaAnchors headingRef={headingRef} />}
      </main>
      <SiteFooter />
      <BottomNav tab={tab} onNavigate={navigate} />
    </>
  );
}

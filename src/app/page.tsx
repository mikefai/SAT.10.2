import { TriangleAlert } from "lucide-react";
import { eq, Frac, Sqrt, System } from "@/components/math/MathText";
import { ThemeToggle } from "@/components/shell/ThemeToggle";
import { Button } from "@/components/ui/Button";
import { Callout } from "@/components/ui/Callout";
import { Card } from "@/components/ui/Card";
import { Pill } from "@/components/ui/Pill";
import { ProgressDots } from "@/components/ui/ProgressDots";

// Temporary design-system specimen (replaced in Task 7).
export default function Page() {
  return (
    <main className="mx-auto max-w-3xl space-y-4 p-6">
      <ThemeToggle />
      <Card>
        <div className="flex flex-wrap gap-2">
          <Button>Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="ghost">Ghost</Button>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <Pill>Neutral</Pill>
          <Pill tone="accent">Accent</Pill>
          <Pill tone="trap">Trap</Pill>
          <Pill tone="ok">OK</Pill>
        </div>
        <div className="mt-4">
          <ProgressDots total={5} current={2} done={[true, true, false, false, false]} label={(i) => `Question ${i + 1}`} />
        </div>
      </Card>
      <Callout tone="trap" title="Trap spotted" icon={TriangleAlert}>
        You forgot to distribute the negative sign.
      </Callout>
      <Callout tone="ok" title="Decoded!" />
      <Callout tone="info" title="Hint">
        Think about what the −2 multiplies.
      </Callout>
      <Card>
        {eq("5 − 2(x − 4) = 3x − 7", true)}
        <p className="text-center">
          <Frac n="4" d="5" /> and 2<Sqrt>7</Sqrt>
        </p>
        <System lines={["2x + 3y = 12", "2x − y = 4"]} />
      </Card>
    </main>
  );
}

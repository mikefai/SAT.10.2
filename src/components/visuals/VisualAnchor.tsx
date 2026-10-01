import type { VisualSpec } from "@/content/types";
import { BalanceSteps } from "./BalanceSteps";
import { CircleDiagram } from "./CircleDiagram";
import { DistributionArrows } from "./DistributionArrows";
import { FractionBar } from "./FractionBar";
import { LinesGraph } from "./LinesGraph";
import { toLevel } from "./levels";
import { RightTriangleSquares } from "./RightTriangleSquares";
import { TargetChain } from "./TargetChain";

export function VisualAnchor({ spec, level }: { spec: VisualSpec; level: number }) {
  const lv = toLevel(level);
  switch (spec.kind) {
    case "distribution":
      return <DistributionArrows factor={spec.factor} terms={spec.terms} products={spec.products} level={lv} />;
    case "target":
      return <TargetChain chain={spec.chain} level={lv} />;
    case "lines":
      return <LinesGraph spec={spec} level={lv} />;
    case "fraction-bar":
      return (
        <FractionBar
          parts={spec.parts}
          partValue={spec.partValue}
          prefix={spec.prefix}
          highlight={spec.highlight}
          extra={spec.extra}
          caption={spec.caption}
          level={lv}
        />
      );
    case "right-triangle":
      return <RightTriangleSquares a={spec.a} b={spec.b} level={lv} />;
    case "circle":
      return <CircleDiagram diameter={spec.diameter} level={lv} />;
    case "balance":
      return <BalanceSteps states={spec.states} level={lv} />;
  }
}

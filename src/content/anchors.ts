import type { AnchorMeta } from "./types";

export const ANCHORS: AnchorMeta[] = [
  { id: "slope", name: "Slope & Lines", formula: "y = mx + b", useFor: "Lines, rates and graphs: the most common SAT topic." },
  { id: "vertex", name: "Vertex Form", formula: "y = a(x − h)² + k", useFor: "Find a parabola’s turning point at a glance." },
  {
    id: "quadratic",
    name: "Quadratic Formula",
    formula: "x = (−b ± √(b² − 4ac)) / 2a",
    useFor: "Solve any quadratic and count its solutions.",
  },
  { id: "pythagorean", name: "Pythagorean Theorem", formula: "a² + b² = c²", useFor: "Find a missing side of a right triangle." },
];

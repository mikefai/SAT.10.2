import { tokensToText, type Token } from "@/lib/math/expressions";
import { ROLE_COLOR } from "./role-colors";

export function FormulaTokens({ tokens, size = "lg" }: { tokens: Token[]; size?: "lg" | "md" }) {
  return (
    <p role="math" aria-label={tokensToText(tokens)} className={`font-math ${size === "lg" ? "text-3xl sm:text-4xl" : "text-xl"}`}>
      {tokens.map((token, i) => (
        <span
          key={i}
          aria-hidden="true"
          className={`${token.italic ? "italic" : ""} ${token.role ? `${ROLE_COLOR[token.role]} font-semibold` : ""}`}
        >
          {token.text}
        </span>
      ))}
    </p>
  );
}

import type { AlgorithmStep } from "../types/types";

function computeLegend(steps: AlgorithmStep[], algorithm: string) {
  const legendMap = new Map<string, string>();
  const SHOW: Record<string, { color: string; defaultName: string }> = {
    highlight: { color: "bg-red-400", defaultName: "pivot" },
    compare: { color: "bg-yellow-200", defaultName: "compare" },
    partition: { color: "bg-emerald-300", defaultName: "partition" },
    element: { color: "bg-blue-200", defaultName: "element" },
  };

  let needDefault = false;

  steps.forEach((s) => {
    const arrLen = s.data?.array?.length || 0;
    const effIdx = new Set<number>();
    (s.effects || []).forEach((eff) => {
      if (!SHOW[eff.type] && !eff.color) return;
      let label = SHOW[eff.type]?.defaultName || eff.label || eff.type;
      if (eff.type === "highlight" && algorithm === "binarySearch" && eff.label) {
        label = eff.label;
      } else if (eff.type === "highlight" && eff.label && algorithm !== "quickSort") {
        label = eff.label;
      } else if (eff.type === "highlight" && algorithm === "quickSort") {
        label = "pivot";
      } else if (eff.label) {
        label = eff.label;
      }
      if (eff.color) legendMap.set(`${eff.color}|${label}`, label);
      else if (SHOW[eff.type]) legendMap.set(`${SHOW[eff.type].color}|${label}`, label);
      (eff.indices || []).forEach((i) => effIdx.add(i));
    });
    for (let idx = 0; idx < arrLen; ++idx) if (!effIdx.has(idx)) needDefault = true;
  });

  if (needDefault) legendMap.set(`${SHOW.element.color}|element`, "element");

  return Array.from(legendMap.entries()).map(([key, label]) => {
    const [color] = key.split("|");
    return { color, name: label };
  });
}

export default function Legend({
  steps,
  algorithm,
}: {
  steps: AlgorithmStep[];
  algorithm: string;
}) {
  const legendList = computeLegend(steps, algorithm);
  if (legendList.length === 0) return null;
  return (
    <div className="flex gap-3 mt-4 text-xs">
      {legendList.map((item) => (
        <span
          key={item.color + item.name}
          className={`${item.color} rounded px-2 py-1 border border-black`}
        >
          {item.name}
        </span>
      ))}
    </div>
  );
}

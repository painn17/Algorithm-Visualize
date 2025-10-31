import type { StepEffect } from "../../types/types";

export default function ArrayVisualizer({
  array,
  effects,
}: {
  array: number[];
  effects: StepEffect[];
}) {
  function colorFor(idx: number) {
    const idxEffects = effects?.filter((e) => e?.indices?.includes(idx)) || [];
    const effectWithColor = idxEffects.find((eff) => eff.color);
    if (effectWithColor) return effectWithColor.color!;
    if (idxEffects.find((eff) => eff.type === "highlight")) return "bg-red-400";
    if (idxEffects.find((eff) => eff.type === "compare")) return "bg-yellow-200";
    if (idxEffects.find((eff) => eff.type === "partition")) return "bg-emerald-300";
    return "bg-blue-200";
  }
  return (
    <div className="flex gap-1 flex-wrap">
      {array.map((v, idx) => (
        <span
          key={idx}
          className={
            colorFor(idx) +
            " px-2 py-1 rounded-full font-medium border border-black min-w-8 text-center text-base"
          }
        >
          {v}
        </span>
      ))}
    </div>
  );
}

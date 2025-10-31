import type { AlgorithmStep } from "../../types/types";
import ArrayVisualizer from "../visualizers/ArrayVisualizer";
import MemoView from "../visualizers/MemoView";

export default function StepList({
  steps,
  algorithm,
}: {
  steps: AlgorithmStep[];
  algorithm: string;
}) {
  if (!steps?.length) return <span className="text-secondary">No steps yet</span>;
  return (
    <div className="flex flex-col gap-2 max-h-[400px] overflow-auto">
      {steps.map((step) => (
        <div
          key={step.stepId}
          className="border-2 border-secondary p-1 rounded-lg h-min bg-white mb-1"
        >
          <ArrayVisualizer array={step.data.array} effects={step.effects} />
          {algorithm === "factorialHash" && step.data.memo && (
            <MemoView memo={step.data.memo} n={step.data.n} />
          )}
        </div>
      ))}
    </div>
  );
}

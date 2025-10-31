import type { AlgorithmStep } from "../../types/types";
import ArrayVisualizer from "../visualizers/ArrayVisualizer";

export type StepWithParent = AlgorithmStep & { parentStepId: number | null };
export type StepTreeNode = { step: StepWithParent; children: StepTreeNode[] };

export function buildStepsTree(steps: StepWithParent[]): StepTreeNode[] {
  const byParent: Record<number | string, StepWithParent[]> = {};
  steps.forEach((step) => {
    const key = step.parentStepId === null ? "null" : String(step.parentStepId);
    if (!byParent[key]) byParent[key] = [];
    byParent[key].push(step);
  });
  function getChildren(parentId: number | null): StepTreeNode[] {
    const key = parentId === null ? "null" : String(parentId);
    return (byParent[key] || []).map((child) => ({
      step: child,
      children: getChildren(child.stepId),
    }));
  }
  return getChildren(null);
}

export default function StepTree({ node, level = 0 }: { node: StepTreeNode; level?: number }) {
  return (
    <div style={{ marginLeft: level * 28 }} className="mb-2">
      <div className="flex items-center gap-2">
        <span className="text-xs text-secondary">
          Step {node.step.stepId} (from{" "}
          {node.step.parentStepId === null ? "root" : node.step.parentStepId})
        </span>
        <ArrayVisualizer array={node.step.data.array} effects={node.step.effects} />
      </div>
      {node.children &&
        node.children.map((n) => <StepTree node={n} level={level + 1} key={n.step.stepId} />)}
    </div>
  );
}

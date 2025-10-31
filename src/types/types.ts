// Possible effect types (extensible list)
export type StepEffectType =
  | "highlight" // Highlight elements (pivot, found, etc.)
  | "compare" // Compare two or more elements
  | "swap" // Swap elements
  | "mark" // Mark an element with a special status
  | "partition" // Belonging to a subset (after partition)
  | "custom"; // For unique actions/visualizations

// Effect descriptor for a visual action at a step
export interface StepEffect {
  type: StepEffectType;
  indices?: number[]; // Indices of elements to which the effect is applied
  label?: string; // Any short label ("pivot", "found", "left", etc.)
  color?: string; // Recommended color (if you want to control it outside the visualizer)
  value?: number | number[]; // Any additional value (e.g., result, new value)
  path?: number[]; // For recursion/nested structures
  [key: string]: any; // Maximal extensibility for other purposes
}

// Description of a single algorithm step for visualization
export interface AlgorithmStep {
  stepId: number; // Unique step number
  algorithm: string; // Algorithm name ("quickSort", "binarySearch", etc.)
  depth: number; // Depth (for recursive/iterative visualizations)
  data: {
    array: number[]; // Current contents of the array/set of values
    [key: string]: any; // Other fields — for rendering or debugging (e.g., target, memo, etc.)
  };
  effects: StepEffect[]; // All visual effects for this step
  path?: number[]; // Nesting path (recursion, tree) — e.g., [0,1,1]
}

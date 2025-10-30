import { useState } from "react";
import CustomButton from "./Button";
import { useAlgorithm } from "../alg";
import type { AlgorithmStep, StepEffect } from "../types/types";

function ArrayVisualizer({ array, effects }: { array: number[]; effects: StepEffect[] }) {
  function colorFor(idx: number) {
    const idxEffects = effects?.filter(e => e?.indices?.includes(idx)) || [];
    // Сначала ищем color
    const effectWithColor = idxEffects.find(eff => eff.color);
    if (effectWithColor) return effectWithColor.color!;
    if (idxEffects.find(eff => eff.type === "highlight")) return "bg-red-400";
    if (idxEffects.find(eff => eff.type === "compare")) return "bg-yellow-200";
    if (idxEffects.find(eff => eff.type === "partition")) return "bg-emerald-300";
    return "bg-blue-200";
  }
  return (
    <div className="flex gap-1 flex-wrap">
      {array.map((v, idx) => (
        <span
          key={idx}
          className={colorFor(idx) + " px-2 py-1 rounded-full font-medium border border-black min-w-8 text-center text-base"}
        >
          {v}
        </span>
      ))}
    </div>
  );
}

// Вспомогательная функция — строит дерево шагов по parentStepId
function buildStepsTree(steps: (AlgorithmStep & { parentStepId: number | null })[]): any[] {
  const byParent: Record<number | string, (AlgorithmStep & { parentStepId: number | null })[]> = {};
  steps.forEach(step => {
    const key = step.parentStepId === null ? 'null' : String(step.parentStepId);
    if (!byParent[key]) byParent[key] = [];
    byParent[key].push(step);
  });
  function getChildren(parentId: number | null): any[] {
    const key = parentId === null ? 'null' : String(parentId);
    return (byParent[key] || []).map(child => ({
      step: child,
      children: getChildren(child.stepId)
    }));
  }
  return getChildren(null);
}

// Рекурсивное дерево
function StepTree({ node, level = 0 }: { node: { step: AlgorithmStep & { parentStepId: number | null }, children: any[] }, level?: number }) {
  return (
    <div style={{ marginLeft: level * 28 }} className="mb-2">
      <div className="flex items-center gap-2">
        <span className="text-xs text-gray-400">Step {node.step.stepId} (from {node.step.parentStepId === null ? 'root' : node.step.parentStepId})</span>
        <ArrayVisualizer array={node.step.data.array} effects={node.step.effects} />
      </div>
      {node.children && node.children.map((n) => (
        <StepTree node={n} level={level + 1} key={n.step.stepId} />
      ))}
    </div>
  );
}

function getLegendTypes(steps: AlgorithmStep[], algorithm: string) {
  // color+label уникальность
  const legendMap = new Map<string, string>();
  const SHOW: Record<string, { color: string; defaultName: string }> = {
    highlight: { color: "bg-red-400", defaultName: "pivot" },
    compare: { color: "bg-yellow-200", defaultName: "compare" },
    partition: { color: "bg-emerald-300", defaultName: "partition" },
    element: { color: "bg-blue-200", defaultName: "element" }
  };

  // флаг наличия дефолтного цвета
  let needDefault = false;

  // для сбора цветов/названий
  steps.forEach((s) => {
    const arrLen = s.data?.array?.length || 0;
    const effIdx = new Set<number>();
    (s.effects || []).forEach((eff) => {
      if (!SHOW[eff.type] && !eff.color) return;
      let label = SHOW[eff.type]?.defaultName || eff.label || eff.type;
      // Для highlight показывать label как название, если binarySearch или label есть явно
      if (eff.type === "highlight" && algorithm === "binarySearch" && eff.label) {
        label = eff.label;
      } else if (eff.type === "highlight" && eff.label && algorithm !== "quickSort") {
        label = eff.label;
      } else if (eff.type === "highlight" && algorithm === "quickSort") {
        label = "pivot";
      } else if (eff.label) {
        label = eff.label;
      }
      if (eff.color) {
        legendMap.set(`${eff.color}|${label}`, label);
      } else if (SHOW[eff.type]) {
        legendMap.set(`${SHOW[eff.type].color}|${label}`, label);
      }
      // отмечаем индекс, на котором был хоть какой-то эффект
      (eff.indices||[]).forEach(i => effIdx.add(i));
    });
    // если есть элементы без эффектов (default), надо включить элемент
    for (let idx = 0; idx < arrLen; ++idx) {
      if (!effIdx.has(idx)) needDefault = true;
    }
  });

  if (needDefault) legendMap.set(`${SHOW.element.color}|element`, "element");

  // Результат: [{color, name}, ...]
  return Array.from(legendMap.entries()).map(([key, label]) => {
    const [color] = key.split("|");
    return { color, name: label };
  });
}

function AlgorithmBlock({ children, algorithm }: { children: React.ReactNode; algorithm: string }) {
  const [arr, setArr] = useState<number[]>([]);
  const [input, setInput] = useState<number>(0);
  const [target, setTarget] = useState<number>(0);
  const { steps, result, run } = useAlgorithm();

  const handleRun = () => {
    switch (algorithm) {
      case "binarySearch":
        run(algorithm, { arr, target });
        break;
      case "factorialHash":
        run(algorithm, input);
        break;
      default:
        run(algorithm, arr);
        break;
    }
  };

  const handleAdd = () => {
    setArr([...arr, input]);
    setInput(0);
  };

  return (
    <div className="flex flex-col items-center p-6 bg-amber-300 rounded-xl shadow-lg w-full max-w-xl mx-auto">
      <h2 className="text-2xl font-bold text-white mb-4 capitalize">{children}</h2>

      <div className="flex gap-2 mb-4">
        <input
          type="number"
          value={input}
          onChange={(e) => setInput(Number(e.target.value))}
          className="w-32 px-2 py-1 rounded-xl text-center text-gray-700 bg-white border focus:outline-none focus:ring-2"
          placeholder={algorithm === "factorialHash" ? "Enter n" : "Enter number"}
        />

        {algorithm !== "factorialHash" && (
          <CustomButton color="bg-green-400" callback={handleAdd}>
            Add
          </CustomButton>
        )}
        <CustomButton
          callback={() => {
            handleRun();
          }}
          color={"bg-blue-500"}
        >
          Run
        </CustomButton>
      </div>

      {algorithm === "binarySearch" && (
        <div className="flex gap-2 mb-4">
          <label className="text-white text-lg font-bold">Target:</label>
          <input
            type="number"
            value={target}
            onChange={(e) => setTarget(Number(e.target.value))}
            placeholder="Target"
            className="w-32 px-2 py-1 rounded-xl text-center text-gray-700 bg-white border focus:outline-none focus:ring-2"
          />
        </div>
      )}

      {algorithm !== "factorialHash" && (
        <div className="w-full bg-white rounded-xl p-4 mb-4 shadow-inner flex flex-col gap-2">
          <p className="text-lg font-semibold mb-2">Array:</p>
          <div className="flex flex-wrap gap-2">
            {arr.length === 0 ? (
              <div className="text-gray-400">No elements added</div>
            ) : (
              arr.map((num, index) => (
                <span key={index} className="bg-blue-200 px-3 py-1 rounded-full font-medium">
                  {num}
                </span>
              ))
            )}
          </div>
          <CustomButton
            callback={() => {
              setArr([]);
              const quantity = Math.random() * 15 + 2;
              for (let i = 0; i < quantity; i++) {
                setArr((prev) => [...prev, Math.floor(Math.random() * 100 - 10)]);
              }
            }}
          >
            Set random array
          </CustomButton>
          <CustomButton color="bg-red-400" callback={() => setArr([])}>
            Clear
          </CustomButton>
        </div>
      )}

      <div className="w-full bg-white rounded-xl p-4 mb-4 shadow-inner">
        <p className="text-lg font-semibold mb-2">Algorithm Steps ({algorithm}):</p>
        {algorithm === "quickSort" ? (
          <div className="max-h-[400px] overflow-auto">
            {buildStepsTree(steps).map(tree => (
              <StepTree node={tree} key={tree.step.stepId} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col gap-2 max-h-[400px] overflow-auto">
            {steps.length === 0 && <span className="text-gray-400">No steps yet</span>}
            {steps.map((step: AlgorithmStep) => (
              <div
                key={step.stepId}
                className="border-2 border-gray-200 p-1 rounded-lg h-min bg-white mb-1"
              >
                <ArrayVisualizer array={step.data.array} effects={step.effects} />
                {algorithm === "factorialHash" && step.data.memo && (
                  <div className="text-xs mt-1 text-blue-900">
                    <div className="font-medium mb-1">Memo:</div>
                    <div className="flex flex-wrap gap-x-4 gap-y-1">
                      {Object.entries(step.data.memo).map(([k, v]) => (
                        <div
                          key={k}
                          className={
                            step.data.n && Number(k) === step.data.n
                              ? "text-emerald-700 font-bold"
                              : ""
                          }
                        >
                          {k} = {v}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
        {/* Легенда по цветам */}
        {(() => {
          const legendList = getLegendTypes(steps, algorithm);
          if (legendList.length === 0) return null;
          return (
            <div className="flex gap-3 mt-4 text-xs">
              {legendList.map((item) => (
                <span key={item.color + item.name} className={`${item.color} rounded px-2 py-1 border border-black`}>
                  {item.name}
                </span>
              ))}
            </div>
          );
        })()}
      </div>
      {result !== null && (
        <div className="w-full bg-white rounded-xl p-4 mb-4 shadow-inner text-center">
          <p className="text-lg font-semibold mb-2">Result:</p>
          <span className="text-green-600 font-medium">
            {Array.isArray(result) ? result.join(", ") : result}
          </span>
        </div>
      )}
    </div>
  );
}

export default AlgorithmBlock;

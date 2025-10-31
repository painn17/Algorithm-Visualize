export default function MemoView({ memo, n }: { memo: Record<number, number>; n?: number }) {
  if (!memo) return null;
  return (
    <div className="text-xs mt-1 text-blue-900">
      <div className="font-medium mb-1">Memo:</div>
      <div className="flex flex-wrap gap-x-4 gap-y-1">
        {Object.entries(memo).map(([k, v]) => (
          <div
            key={k}
            className={n && Number(k) === n ? "text-emerald-700 font-bold text-sm" : "text-sm"}
          >
            {k} = {v}
          </div>
        ))}
      </div>
    </div>
  );
}

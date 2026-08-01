const FILTERS = [
  { key: "all", label: "すべて" },
  { key: "active", label: "未完了" },
  { key: "completed", label: "完了" },
];

// フィルター切り替えボタン（すべて / 未完了 / 完了）
export default function FilterBar({ filter, onFilterChange }) {
  return (
    <div className="flex justify-center gap-2">
      {FILTERS.map((f) => (
        <button
          key={f.key}
          type="button"
          onClick={() => onFilterChange(f.key)}
          className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
            filter === f.key
              ? "bg-indigo-600 text-white"
              : "bg-white text-zinc-600 hover:bg-zinc-100 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
          }`}
        >
          {f.label}
        </button>
      ))}
    </div>
  );
}

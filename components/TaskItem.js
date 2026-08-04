// タスク1件分の行（チェックボックス・テキスト・削除ボタン）
export default function TaskItem({ task, onToggle, onDelete }) {
  return (
    <li className="flex items-center gap-3 rounded-lg bg-white px-4 py-3 shadow-sm dark:bg-zinc-800">
      <input
        type="checkbox"
        checked={task.completed}
        onChange={() => onToggle(task.id)}
        className="h-5 w-5 shrink-0 rounded border-zinc-300 text-sky-600 focus:ring-sky-500"
      />
      <span
        className={`flex-1 break-words text-sm ${
          task.completed
            ? "text-zinc-400 line-through dark:text-zinc-500"
            : "text-zinc-800 dark:text-zinc-100"
        }`}
      >
        {task.text}
      </span>
      <button
        type="button"
        onClick={() => onDelete(task.id)}
        aria-label="削除"
        className="shrink-0 rounded-full p-1.5 text-zinc-400 transition-colors hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-950"
      >
        ✕
      </button>
    </li>
  );
}

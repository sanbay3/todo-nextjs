import TaskItem from "./TaskItem";

// タスクの一覧表示。中身はTaskItemを並べるだけのシンプルな役割
export default function TaskList({ tasks, onToggle, onDelete }) {
  if (tasks.length === 0) {
    return (
      <p className="py-8 text-center text-sm text-zinc-400 dark:text-zinc-500">
        タスクがありません
      </p>
    );
  }

  return (
    <ul className="flex flex-col gap-2">
      {tasks.map((task) => (
        // key={task.id} はReactがリストの各要素を正しく識別するための目印。
        // これがないと、追加・削除・並び替え時にReactがどの要素がどれか
        // 見分けられず、チェック状態などが別の行に紐づいてしまうことがある。
        // 配列のindexではなくcrypto.randomUUID()で作った一意なidを使うのが安全。
        <TaskItem
          key={task.id}
          task={task}
          onToggle={onToggle}
          onDelete={onDelete}
        />
      ))}
    </ul>
  );
}

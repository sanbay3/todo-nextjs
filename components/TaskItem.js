// 今日の日付を "YYYY-MM-DD" 形式の文字列で返す。
//
// new Date().toISOString() は使わない。toISOString()はUTC（世界標準時）基準の
// 日時に変換してから文字列化するため、日本（UTC+9）では例えば
// 「8月12日 午前3時」に実行すると、UTCではまだ8月11日のため
// 1日ズレた日付になってしまうことがある。
// ここではブラウザのローカルタイムゾーンの年月日をそのまま組み立てる。
function getTodayString() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0"); // getMonth()は0始まり
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

// "YYYY-MM-DD" を "8月12日" のような表示用文字列に変換する。
// Dateオブジェクトに変換せず文字列を分割するだけにしているのも、
// 上記と同じ理由（タイムゾーンによる日付のズレ）を避けるため。
function formatDueDate(dateStr) {
  const [, month, day] = dateStr.split("-");
  return `${Number(month)}月${Number(day)}日`;
}

// タスク1件分の行（チェックボックス・テキスト・期限・削除ボタン）
export default function TaskItem({ task, onToggle, onDelete }) {
  // 期限が今日より前 かつ 未完了 のときだけ「期限切れ」として強調する。
  // 文字列同士でも "YYYY-MM-DD" 形式なら < で日付の前後を正しく比較できる。
  //
  // task.dueDate は !task.dueDate（truthy判定）で確認している。
  // この機能を追加する前にlocalStorageへ保存されたタスクにはdueDate
  // フィールド自体が存在しない（undefined）ため、nullとの厳密比較（!== null）
  // だけだとundefinedをすり抜けてしまい、下のformatDueDate(undefined)で
  // エラーになってしまう。
  const isOverdue =
    !task.completed && Boolean(task.dueDate) && task.dueDate < getTodayString();

  return (
    <li className="flex items-center gap-3 rounded-lg bg-white px-4 py-3 shadow-sm dark:bg-zinc-800">
      <input
        type="checkbox"
        checked={task.completed}
        onChange={() => onToggle(task.id)}
        className="h-5 w-5 shrink-0 rounded border-zinc-300 text-sky-600 focus:ring-sky-500"
      />
      {/* min-w-0がないと、flexの子要素は中身の長さ分まで縮まなくなり、
          長いタスク文字列がはみ出してレイアウトが崩れることがある。 */}
      <div className="min-w-0 flex-1">
        <span
          className={`block break-words text-sm ${
            task.completed
              ? "text-zinc-400 line-through dark:text-zinc-500"
              : "text-zinc-800 dark:text-zinc-100"
          }`}
        >
          {task.text}
        </span>
        {task.dueDate && (
          <span
            className={`text-xs ${
              isOverdue
                ? "font-medium text-red-500"
                : "text-zinc-400 dark:text-zinc-500"
            }`}
          >
            {isOverdue ? "期限切れ：" : "期限："}
            {formatDueDate(task.dueDate)}
          </span>
        )}
      </div>
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

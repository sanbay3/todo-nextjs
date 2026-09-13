import { useState } from "react";

// タスクを新規追加するための入力フォーム
export default function TaskForm({ onAdd }) {
  // このコンポーネント自身は "use client" を書かなくてOK。
  // page.js（親）が "use client" なので、そこからimportされる時点で
  // このファイルも自動的にクライアント側の部品として扱われる。
  const [text, setText] = useState("");
  // 期限（<input type="date">の値は常に "YYYY-MM-DD" 形式の文字列になる）。
  // 期限は必須にせず、空文字のままなら「期限なし」として扱う。
  const [dueDate, setDueDate] = useState("");

  const handleSubmit = (e) => {
    // フォーム送信時のページ再読み込み（デフォルト動作）を止める
    e.preventDefault();

    const trimmed = text.trim();
    if (trimmed === "") return; // 空文字は追加しない

    onAdd(trimmed, dueDate); // 親（TodoApp）に「追加して」と伝える
    setText(""); // 入力欄を空に戻す
    setDueDate("");
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2">
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="タスクを入力..."
        className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-2 text-sm text-zinc-900 placeholder-zinc-400 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
      />
      <div className="flex items-end gap-2">
        <div className="flex-1">
          {/* 見た目に出ないaria-labelだけでは「これが何の日付か」「省略可能か」が
              画面を見ただけでは伝わらなかったため、目に見えるラベルに変更した。
              htmlFor/idで<label>と<input>を紐づけると、ラベル文字をクリック/
              タップしても入力欄にフォーカスが移るので、押せる範囲も広がる。 */}
          <label
            htmlFor="task-due-date"
            className="mb-1 block text-xs text-zinc-500 dark:text-zinc-400"
          >
            期限（任意）
          </label>
          <input
            id="task-due-date"
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-500 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
          />
        </div>
        <button
          type="submit"
          className="shrink-0 rounded-lg bg-sky-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-sky-700"
        >
          追加
        </button>
      </div>
    </form>
  );
}

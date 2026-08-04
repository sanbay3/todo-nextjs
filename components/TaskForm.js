import { useState } from "react";

// タスクを新規追加するための入力フォーム
export default function TaskForm({ onAdd }) {
  // このコンポーネント自身は "use client" を書かなくてOK。
  // page.js（親）が "use client" なので、そこからimportされる時点で
  // このファイルも自動的にクライアント側の部品として扱われる。
  const [text, setText] = useState("");

  const handleSubmit = (e) => {
    // フォーム送信時のページ再読み込み（デフォルト動作）を止める
    e.preventDefault();

    const trimmed = text.trim();
    if (trimmed === "") return; // 空文字は追加しない

    onAdd(trimmed); // 親（page.js）に「追加して」と伝える
    setText(""); // 入力欄を空に戻す
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="タスクを入力..."
        className="flex-1 rounded-lg border border-zinc-300 bg-white px-4 py-2 text-sm text-zinc-900 placeholder-zinc-400 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
      />
      <button
        type="submit"
        className="shrink-0 rounded-lg bg-sky-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-sky-700"
      >
        追加
      </button>
    </form>
  );
}

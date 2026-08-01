// このファイルの一番上に "use client" と書くことで、
// このコンポーネントが「クライアントコンポーネント」であるとNext.jsに伝える。
// 下のnext/dynamicで ssr: false を使うには、呼び出し元もクライアント
// コンポーネントである必要がある（サーバーコンポーネントからは使えない）。
"use client";

import dynamic from "next/dynamic";

// TodoAppを「ssr: false」で読み込む＝このコンポーネントはサーバー側では
// 一切レンダリングせず、ブラウザ上でのみ動かす、という指定。
//
// なぜそうするのか？
// TodoAppはlocalStorageに保存されたタスクを画面表示に使う。しかし
// localStorageはサーバー上に存在しないため、サーバー側で描画すると
// 常に「タスクが1件も無い状態」のHTMLしか作れない。
// もしその後ブラウザ側で保存済みタスクを読み込んで表示を差し替えると、
// 「サーバーが送ったHTML」と「ブラウザが実際に表示する内容」が食い違い、
// Reactのhydration（サーバーの描画結果とブラウザの描画結果を照合し、
// 効率よく引き継ぐ処理）でエラーが発生してしまう。
// ssr: false を指定すると、サーバーは何も描画しないため比較対象が無く、
// このエラーを根本的に避けられる。読み込み中は下のloadingで指定した
// 内容が一瞬表示される。
const TodoApp = dynamic(() => import("@/components/TodoApp"), {
  ssr: false,
  loading: () => (
    <div className="w-full max-w-md rounded-2xl bg-zinc-100 p-6 text-center text-sm text-zinc-400 shadow-sm dark:bg-zinc-900 dark:text-zinc-500 sm:p-8">
      読み込み中...
    </div>
  ),
});

export default function Home() {
  return (
    <div className="flex flex-1 flex-col items-center bg-zinc-50 px-4 py-10 dark:bg-black sm:py-16">
      <TodoApp />
    </div>
  );
}

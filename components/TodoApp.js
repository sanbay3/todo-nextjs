"use client";

import { useEffect, useState } from "react";
import TaskForm from "@/components/TaskForm";
import TaskList from "@/components/TaskList";
import FilterBar from "@/components/FilterBar";

// localStorageに保存する際のキー名。タイプミス防止のため定数化。
const STORAGE_KEY = "todo-nextjs:tasks";

// localStorageから保存済みタスクを読み込む。
// このコンポーネントはapp/page.jsからssr: falseで読み込まれるため、
// 実際にはブラウザ上でしか実行されないが、念のためwindowの存在も確認しておく。
function loadTasks() {
  if (typeof window === "undefined") return [];
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    // 保存データが壊れていた場合は空のリストから始める
    return [];
  }
}

export default function TodoApp() {
  // タスク一覧。1件は { id, text, completed } という形のオブジェクト。
  //
  // useState(loadTasks) のように「関数」を初期値として渡すと、
  // Reactはその関数を最初のレンダリング時に1回だけ呼び出し、戻り値を
  // 初期状態として使う（これを「遅延初期化」と呼ぶ）。
  //
  // 補足：最初は useEffect の中で読み込む書き方だったが、2つの理由で
  // この形に変更した。
  // 1) このプロジェクトのESLint設定（react-hooks/set-state-in-effect）が
  //    「useEffect内で直接setStateを呼ぶとレンダリングが連鎖して無駄が多い」
  //    という理由でエラーにするため。
  // 2) useEffectでの読み込みだと、サーバーが返す最初のHTML（空リスト）と、
  //    ブラウザがuseEffect実行後に表示する内容（保存済みタスク）が食い違い、
  //    Reactの「hydrationエラー」（サーバーとクライアントの描画結果が
  //    一致しない、という警告兼エラー）が発生してしまう。
  // このコンポーネントはapp/page.jsでssr: falseとして読み込まれ、
  // サーバー側では一切描画されない＝比較対象のサーバーHTMLが無いので、
  // 遅延初期化でlocalStorageを直接読んでも矛盾が起きない。
  const [tasks, setTasks] = useState(loadTasks);
  // 現在選択中のフィルター（"all" | "active" | "completed"）
  const [filter, setFilter] = useState("all");

  // 保存用useEffect：tasksが変化するたびに実行され、localStorageに書き込む。
  // ここでは「Reactの外側にある仕組み（localStorage）を、Reactの最新の状態に
  // 合わせて更新する」だけなので、setStateを呼んでいない＝先述のESLintルールにも
  // 引っかからない、正しいuseEffectの使い方になっている。
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }, [tasks]);

  // タスクを追加する
  const addTask = (text) => {
    const newTask = {
      // Date.now()は同じミリ秒内に連続追加すると重複する可能性があるため、
      // 常に一意な値を作れるcrypto.randomUUID()を使う。
      id: crypto.randomUUID(),
      text,
      completed: false,
    };
    // setTasks(prev => ...) の形（関数を渡す形）を使うと、
    // 常に「直前の最新のtasks」を元に新しい配列を作れるので安全。
    setTasks((prev) => [...prev, newTask]);
  };

  // 完了/未完了を切り替える
  const toggleTask = (id) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  // タスクを削除する
  const deleteTask = (id) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
  };

  // 表示用に、選択中のフィルターに応じてtasksを絞り込む。
  // ここではsetTasksを使わない＝元のtasksは変更せず、表示だけを絞り込んでいる。
  const filteredTasks = tasks.filter((task) => {
    if (filter === "active") return !task.completed;
    if (filter === "completed") return task.completed;
    return true; // "all"
  });

  const remainingCount = tasks.filter((task) => !task.completed).length;

  return (
    <div className="w-full max-w-md rounded-2xl bg-zinc-100 p-6 shadow-sm dark:bg-zinc-900 sm:p-8">
      <h1 className="mb-6 text-center text-2xl font-bold text-zinc-900 dark:text-zinc-50">
        ToDo App
      </h1>

      <TaskForm onAdd={addTask} />

      <div className="my-5">
        <FilterBar filter={filter} onFilterChange={setFilter} />
      </div>

      <TaskList tasks={filteredTasks} onToggle={toggleTask} onDelete={deleteTask} />

      {tasks.length > 0 && (
        <p className="mt-5 text-center text-xs text-zinc-400 dark:text-zinc-500">
          残り {remainingCount} 件
        </p>
      )}
    </div>
  );
}

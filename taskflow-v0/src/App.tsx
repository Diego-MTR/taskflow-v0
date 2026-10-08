 import { useEffect, useState } from "react";

import { FilterBar } from "./components/FilterBar";
import { TaskForm } from "./components/TaskForm";
import { TaskList } from "./components/TaskList";
import { nextStatus, type Filter, type Task } from "./types";

import { useLocalStorage } from "./hook/useLocalStorage";

export default function App() {
  const [tasks, setTasks] = useLocalStorage<Task[]>("tasks", []);
  const [filter, setFilter] = useState<Filter>("all");

  // États dérivés : calculés pendant le rendu, jamais dupliqués dans un useState
  const visible = filter === "all" ? tasks : tasks.filter((t) => t.status === filter);
  const remaining = tasks.filter((t) => t.status !== "done").length;

  useEffect(() => {
    document.title = `(${remaining}) TaskFlow`;
  }, [remaining]);

  const add = (title: string) =>
    setTasks((prev) => [...prev, { id: crypto.randomUUID(), title, status: "todo", priority: 2 }]);
  const cycle = (id: string) =>
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, status: nextStatus(t.status) } : t)));
  const remove = (id: string) => setTasks((prev) => prev.filter((t) => t.id !== id));

  return (
    <main className="app">
      <h1>TaskFlow <small>{remaining} restante(s)</small></h1>
      <TaskForm onAdd={add} />
      <FilterBar value={filter} onChange={setFilter} />
      <TaskList tasks={visible} onCycle={cycle} onRemove={remove} />
    </main>
  );
}
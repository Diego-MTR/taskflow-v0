import { useEffect, useState } from "react";
import { Card } from "./components/Card";
import { FilterBar } from "./components/FilterBar";
import { FocusTimer } from "./components/FocusTimer";
import { TaskForm } from "./components/TaskForm";
import { TaskList } from "./components/TaskList";
import { ThemeToggle } from "./components/ThemeToggle";
import { ThemeProvider } from "./context/ThemeContext";
import { useLocalStorage } from "./hooks/useLocalStorage";
import { nextStatus, type Filter, type Priority, type Task } from "./types";

function Board() {
  // Tâches sauvegardées dans le navigateur (hook personnalisé)
  const [tasks, setTasks] = useLocalStorage<Task[]>("taskflow-tasks", []);
  const [filter, setFilter] = useState<Filter>("all");
  const [search, setSearch] = useState("");

  // États dérivés : calculés pendant le rendu, jamais dupliqués dans un useState
  const query = search.trim().toLowerCase();
  const visible = tasks.filter(
    (t) => (filter === "all" || t.status === filter) && t.title.toLowerCase().includes(query),
  );
  const remaining = tasks.filter((t) => t.status !== "done").length;

  // Synchroniser le titre de l'onglet avec les tâches restantes
  useEffect(() => {
    document.title = remaining > 0 ? `(${remaining}) TaskFlow` : "TaskFlow";
  }, [remaining]);

  const add = (title: string, priority: Priority) =>
    setTasks((prev) => [...prev, { id: crypto.randomUUID(), title, status: "todo", priority }]);
  const cycle = (id: string) =>
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, status: nextStatus(t.status) } : t)));
  const remove = (id: string) => setTasks((prev) => prev.filter((t) => t.id !== id));
  // Bonus : tout effacer, après confirmation
  const clearAll = () => {
    if (window.confirm(`Supprimer les ${tasks.length} tâche(s) ?`)) setTasks([]);
  };

  return (
    <main className="app">
      <header className="topbar">
        <h1>TaskFlow <small>{remaining} restante(s)</small></h1>
        <ThemeToggle />
      </header>
      <Card title="Concentration">
        <FocusTimer />
      </Card>
      <Card title="Mes tâches" actions={<FilterBar value={filter} onChange={setFilter} />}>
        <TaskForm onAdd={add} />
        <div className="toolbar">
          <label htmlFor="search" className="sr-only">
            Rechercher une tâche
          </label>
          <input
            id="search"
            type="search"
            className="search"
            value={search}
            placeholder="Rechercher par titre…"
            onChange={(e) => setSearch(e.target.value)}
          />
          <button type="button" className="danger" onClick={clearAll} disabled={tasks.length === 0}>
            Tout effacer
          </button>
        </div>
        <TaskList tasks={visible} onCycle={cycle} onRemove={remove} />
      </Card>
    </main>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <Board />
    </ThemeProvider>
  );
}

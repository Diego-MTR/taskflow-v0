import { useEffect, useMemo, useRef, useState } from "react";
import type { Task } from "../types";

type Props = { task: Task };

const countWords = (text: string) => text.trim().split(/\s+/).filter(Boolean).length;

export function TaskEditor({ task }: Props) {
  const [title, setTitle] = useState(task.title); // case 1
  const [saving] = useState(false); // case 2
  const inputRef = useRef<HTMLInputElement>(null); // case 3

  useEffect(() => {
    inputRef.current?.focus();
  }, []); // case 4

  const words = useMemo(
    () => countWords(title),
    [title]
  ); // case 5

  return (
    <form>
      <input
        ref={inputRef}
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <small>{words} mots</small>
      <button disabled={saving}>Enregistrer</button>
    </form>
  );
}

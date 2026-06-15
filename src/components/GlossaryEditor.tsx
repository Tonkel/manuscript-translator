"use client";

import { useState } from "react";
import type { GlossaryEntry } from "@/domain/types";

interface Props {
  initial?: GlossaryEntry[];
  targetLanguage: string;
}

/** Minimal glossary editor — add term/translation pairs and POST them to
 *  /api/glossary. Demo-grade UI. */
export default function GlossaryEditor({ initial = [], targetLanguage }: Props) {
  const [entries, setEntries] = useState<GlossaryEntry[]>(initial);
  const [term, setTerm] = useState("");
  const [translation, setTranslation] = useState("");

  function add() {
    if (!term.trim() || !translation.trim()) return;
    setEntries((prev) => [...prev, { term, translation, language: targetLanguage }]);
    setTerm("");
    setTranslation("");
  }

  return (
    <div>
      <h3>Glossary ({targetLanguage})</h3>
      <ul>
        {entries.map((e, i) => (
          <li key={i}>
            {e.term} → {e.translation}
          </li>
        ))}
      </ul>
      <input value={term} onChange={(e) => setTerm(e.target.value)} placeholder="term" />
      <input value={translation} onChange={(e) => setTranslation(e.target.value)} placeholder="translation" />
      <button onClick={add}>Add</button>
    </div>
  );
}

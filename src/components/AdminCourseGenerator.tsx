import { httpsCallable, getFunctions } from "firebase/functions";
import { useState } from "react";

const SUBJECTS = [
  { key: "micro", label: "Microeconomics" },
  { key: "macro", label: "Macroeconomics" },
  { key: "entrepreneurship", label: "Entrepreneurship" },
  { key: "finance", label: "Finance" },
  { key: "marketing", label: "Marketing" },
  { key: "decision", label: "Decision Making" },
] as const;

const LEVELS = [100, 200, 300, 400, "grad"] as const;

type SubjectKey = typeof SUBJECTS[number]["key"];

async function callGen(fnName: string, payload: any) {
  const functions = getFunctions();
  const fn = httpsCallable(functions, fnName);
  return fn(payload).then((r: any) => r.data);
}

export default function AdminCourseGenerator() {
  const [subject, setSubject] = useState<SubjectKey>("micro");
  const [level, setLevel] = useState<number | "grad">(100);
  const [log, setLog] = useState<string>("");
  const [busy, setBusy] = useState(false);

  async function runOne() {
    setBusy(true); setLog("Generating...\n");
    try {
      const res = await callGen("generateCourse", { subject, level });
      setLog((s) => s + `Done: ${JSON.stringify(res)}\n`);
    } catch (e: any) {
      setLog((s) => s + `Error: ${e.message}\n`);
    } finally { setBusy(false); }
  }

  async function runAllLevels() {
    setBusy(true); setLog("Generating all levels...\n");
    try {
      const res = await callGen("generateAllLevelsForSubject", { subject });
      setLog((s) => s + `Done: ${JSON.stringify(res)}\n`);
    } catch (e: any) {
      setLog((s) => s + `Error: ${e.message}\n`);
    } finally { setBusy(false); }
  }

  return (
    <div style={{ maxWidth: 560 }}>
      <h2>Course Generator (Gemini + TTS)</h2>
      <label>Subject: </label>
      <select value={subject} onChange={(e) => setSubject(e.target.value as SubjectKey)}>
        {SUBJECTS.map(s => <option key={s.key} value={s.key}>{s.label}</option>)}
      </select>
      <label style={{ marginLeft: 12 }}>Level: </label>
      <select value={String(level)} onChange={(e) => setLevel((e.target.value === 'grad' ? 'grad' : Number(e.target.value)))}>
        {LEVELS.map(L => <option key={String(L)} value={String(L)}>{String(L)}</option>)}
      </select>
      <div style={{ marginTop: 12 }}>
        <button disabled={busy} onClick={runOne}>Generate Subject + Level</button>
        <button disabled={busy} onClick={runAllLevels} style={{ marginLeft: 8 }}>Generate All Levels</button>
      </div>
      <pre style={{ background: '#111', color: '#0f0', padding: 12, marginTop: 12, minHeight: 160 }}>{log}</pre>
    </div>
  );
}

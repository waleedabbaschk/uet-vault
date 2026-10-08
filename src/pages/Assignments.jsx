import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { assignments } from "../data/assignments.js";
import { semesters } from "../data/semesters.js";
import "../styles/assignments.css";

const SECTIONS = ["A", "B", "C"];
const subjects = semesters.flatMap((s) => s.subjects);
const nameOf = (slug) => {
  const s = subjects.find((x) => x.slug === slug);
  return s ? s.name : slug;
};

const parse = (d) => {
  const [y, m, day] = d.split("-").map(Number);
  return new Date(y, m - 1, day);
};
const startOfDay = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
const weekStart = (d) => {
  const x = startOfDay(d);
  x.setDate(x.getDate() - ((x.getDay() + 6) % 7));
  return x;
};

function groupOf(dateStr) {
  const today = startOfDay(new Date());
  const d = parse(dateStr);
  if (d.getTime() === today.getTime()) return "today";
  const ws = weekStart(today);
  const lw = new Date(ws);
  lw.setDate(lw.getDate() - 7);
  if (d >= ws) return "week";
  if (d >= lw) return "last";
  return "earlier";
}

function dueInfo(due) {
  if (!due) return null;
  const today = startOfDay(new Date());
  const diff = Math.round((parse(due) - today) / 86400000);
  if (diff < 0) return { text: "Overdue by " + -diff + (diff === -1 ? " day" : " days"), cls: "late" };
  if (diff === 0) return { text: "Due today", cls: "soon" };
  if (diff === 1) return { text: "Due tomorrow", cls: "soon" };
  return { text: "Due in " + diff + " days", cls: "ok" };
}

const fmt = (d) =>
  parse(d).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });

const GROUPS = [
  ["today", "Today"],
  ["week", "This week"],
  ["last", "Last week"],
  ["earlier", "Earlier"],
];

function Card({ a }) {
  const due = dueInfo(a.due);
  const long = a.points && a.points.length > 8;
  return (
    <article className="a-card">
      <div className="a-top">
        <span className="a-badge">{nameOf(a.subject)}</span>
        {(a.tags || []).map((t) => (
          <span className="a-tag" key={t}>{t}</span>
        ))}
        {due && <span className={"a-due " + due.cls}>{due.text}</span>}
      </div>

      <h3 className="a-name">{a.title}</h3>
      {a.details && <p className="a-text">{a.details}</p>}

      {a.points && a.points.length > 0 && (
        long ? (
          <details className="a-more">
            <summary>Show all {a.points.length} items</summary>
            <ol className="a-list">{a.points.map((p) => <li key={p}>{p}</li>)}</ol>
          </details>
        ) : (
          <ol className="a-list">{a.points.map((p) => <li key={p}>{p}</li>)}</ol>
        )
      )}

      {a.example && (
        <details className="a-more">
          <summary>{a.exampleTitle || "Example"}</summary>
          <ol className="a-list">{a.example.map((p) => <li key={p}>{p}</li>)}</ol>
        </details>
      )}

      {a.quote && (
        <details className="a-more">
          <summary>Show the text to copy</summary>
          <blockquote className="a-quote">{a.quote}</blockquote>
        </details>
      )}

      {a.note && <p className="a-note">{a.note}</p>}

      <div className="a-foot">
        <span className="a-date">Given: {fmt(a.date)}{a.due ? " | Deadline: " + fmt(a.due) : ""}</span>
        {a.link && <a className="btn btn-dark" href={a.link} target="_blank" rel="noreferrer">Open</a>}
      </div>
    </article>
  );
}

export default function Assignments() {
  const [sp, setSp] = useSearchParams();
  const sec = SECTIONS.includes(sp.get("section")) ? sp.get("section") : "C";
  const [subject, setSubject] = useState("all");

  const mine = assignments.filter((a) => a.sections.includes(sec));
  const list = mine
    .filter((a) => subject === "all" || a.subject === subject)
    .sort((a, b) => b.date.localeCompare(a.date));
  const count = (s) => assignments.filter((a) => a.sections.includes(s)).length;

  return (
    <main className="page">
      <p className="eyebrow">BSCS | SEMESTER 1</p>
      <h1 className="sec-title">Assignments</h1>
      <p className="sec-sub">
        Choose your section. Assignments stay here until they are removed, grouped by when they were given.
      </p>

      <div className="asec-tabs" role="tablist" aria-label="Section">
        {SECTIONS.map((s) => (
          <button
            key={s}
            role="tab"
            aria-selected={sec === s}
            className={"asec-tab" + (sec === s ? " on" : "")}
            onClick={() => setSp({ section: s }, { replace: true })}
          >
            <b>CS Section {s}</b>
            <span>{count(s)} {count(s) === 1 ? "assignment" : "assignments"}</span>
          </button>
        ))}
      </div>

      <div className="filters">
        <select value={subject} onChange={(e) => setSubject(e.target.value)} aria-label="Subject">
          <option value="all">All subjects</option>
          {subjects.map((s) => <option key={s.slug} value={s.slug}>{s.name}</option>)}
        </select>
      </div>

      {list.length === 0 && (
        <div className="empty">No assignments added for Section {sec} yet.</div>
      )}

      {GROUPS.map(([key, label]) => {
        const items = list.filter((a) => groupOf(a.date) === key);
        if (items.length === 0) return null;
        return (
          <section className="a-group" key={key}>
            <h2 className="a-title">{label} <span className="a-count">{items.length}</span></h2>
            <div className="a-grid">
              {items.map((a) => <Card key={a.id} a={a} />)}
            </div>
          </section>
        );
      })}
    </main>
  );
}
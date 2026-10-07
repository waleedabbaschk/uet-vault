import { useState } from "react";
import { assignments } from "../data/assignments.js";
import { semesters } from "../data/semesters.js";
import "../styles/assignments.css";

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

const GROUPS = [
  ["today", "Today"],
  ["week", "This week"],
  ["last", "Last week"],
  ["earlier", "Earlier"],
];

export default function Assignments() {
  const [subject, setSubject] = useState("all");
  const list = assignments
    .filter((a) => subject === "all" || a.subject === subject)
    .sort((a, b) => b.date.localeCompare(a.date));

  return (
    <main className="page">
      <p className="eyebrow">BSCS | SECTION C</p>
      <h1 className="sec-title">Assignments</h1>
      <p className="sec-sub">Updated regularly. Today, this week and last week, all in one place.</p>

      <div className="filters">
        <select value={subject} onChange={(e) => setSubject(e.target.value)}>
          <option value="all">All subjects</option>
          {subjects.map((s) => <option key={s.slug} value={s.slug}>{s.name}</option>)}
        </select>
      </div>

      {list.length === 0 && <div className="empty">No assignments yet.</div>}

      {GROUPS.map(([key, label]) => {
        const items = list.filter((a) => groupOf(a.date) === key);
        if (items.length === 0) return null;
        return (
          <section className="a-group" key={key}>
            <h2 className="a-title">{label} <span className="a-count">{items.length}</span></h2>
            <div className="file-list">
              {items.map((a) => {
                const due = dueInfo(a.due);
                return (
                  <article className="a-card" key={a.title + a.date}>
                    <div className="a-main">
                      <span className="a-badge">{nameOf(a.subject)}</span>
                      <h3>{a.title}</h3>
                      {a.details && <p>{a.details}</p>}
                      <p className="file-meta">Given: {a.date}{a.due ? " | Deadline: " + a.due : ""}</p>
                    </div>
                    <div className="a-side">
                      {due && <span className={"a-due " + due.cls}>{due.text}</span>}
                      {a.link && <a className="btn btn-dark" href={a.link} target="_blank" rel="noreferrer">Open</a>}
                    </div>
                  </article>
                );
              })}
            </div>
          </section>
        );
      })}
    </main>
  );
}

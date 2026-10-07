import { useState } from "react";
import { resources } from "../data/resources.js";
import { semesters } from "../data/semesters.js";
import useSearch from "../hooks/useSearch.js";
import SearchBar from "../components/ui/SearchBar.jsx";
import FileCard from "../components/ui/FileCard.jsx";

const TYPES = ["all", "notes", "slides", "books", "assignments", "past-papers", "links"];

export default function Library() {
  const [type, setType] = useState("all");
  const [subject, setSubject] = useState("all");
  const subjects = semesters.flatMap((s) => s.subjects);
  const base = resources.filter(
    (r) => (type === "all" || r.type === type) && (subject === "all" || r.subject === subject)
  );
  const { query, setQuery, results } = useSearch(base);

  return (
    <main className="page">
      <h1 className="sec-title">Library</h1>
      <p className="sec-sub">Every file in one place. Search or filter by subject and type.</p>
      <SearchBar value={query} onChange={setQuery} />
      <div className="filters">
        <select value={subject} onChange={(e) => setSubject(e.target.value)}>
          <option value="all">All subjects</option>
          {subjects.map((s) => <option key={s.slug} value={s.slug}>{s.name}</option>)}
        </select>
        <select value={type} onChange={(e) => setType(e.target.value)}>
          {TYPES.map((t) => <option key={t} value={t}>{t === "all" ? "All types" : t.replace("-", " ")}</option>)}
        </select>
      </div>
      {results.length === 0 ? (
        <div className="empty">No files found.</div>
      ) : (
        <div className="file-list">{results.map((r) => <FileCard key={r.file} item={r} />)}</div>
      )}
    </main>
  );
}

import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { semesters } from "../data/semesters.js";
import { resources } from "../data/resources.js";
import SubjectTabs from "../components/ui/SubjectTabs.jsx";
import FileCard from "../components/ui/FileCard.jsx";

const nat = (a, b) => a.localeCompare(b, undefined, { numeric: true });

export default function Subject() {
  const { sem, subject } = useParams();
  const [type, setType] = useState("notes");
  const semester = semesters.find((s) => String(s.id) === sem);
  const info = semester ? semester.subjects.find((s) => s.slug === subject) : null;

  if (!info) {
    return (
      <main className="page">
        <h1 className="sec-title">Subject not found</h1>
        <Link to="/semesters" className="btn btn-dark">Back to semesters</Link>
      </main>
    );
  }

  const files = resources.filter((r) => String(r.semester) === sem && r.subject === subject);
  const shown = files.filter((f) => f.type === type).sort((a, b) => nat(a.title, b.title));
  const groups = [...new Set(shown.map((f) => f.group || ""))].sort(nat);

  return (
    <main className="page">
      <p className="crumbs"><Link to="/semesters">Semesters</Link> / Semester {sem}</p>
      <h1 className="sec-title">{info.name}</h1>
      <SubjectTabs files={files} active={type} onChange={setType} />
      {shown.length === 0 ? (
        <div className="empty">No {type.replace("-", " ")} uploaded yet.</div>
      ) : (
        groups.map((g) => {
          const list = shown.filter((f) => (f.group || "") === g);
          return (
            <section className="grp" key={g || "all"}>
              {g && <h2 className="grp-title">{g} <span className="a-count">{list.length}</span></h2>}
              <div className="file-list">
                {list.map((r) => <FileCard key={r.file} item={r} />)}
              </div>
            </section>
          );
        })
      )}
    </main>
  );
}

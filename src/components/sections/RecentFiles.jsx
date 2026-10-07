import { resources } from "../../data/resources.js";
import FileCard from "../ui/FileCard.jsx";

export default function RecentFiles() {
  const latest = [...resources].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 6);
  return (
    <section className="recent">
      <h2 className="sec-title">Recently added</h2>
      <p className="sec-sub">The newest notes, slides and books.</p>
      {latest.length === 0 ? (
        <div className="empty">No files uploaded yet. First uploads coming soon.</div>
      ) : (
        <div className="file-list">
          {latest.map((r) => <FileCard key={r.file} item={r} />)}
        </div>
      )}
    </section>
  );
}

const TABS = ["notes", "slides", "books", "assignments", "past-papers", "links"];

export default function SubjectTabs({ files, active, onChange }) {
  return (
    <div className="tabs">
      {TABS.map((t) => {
        const count = files.filter((f) => f.type === t).length;
        return (
          <button key={t} className={"tab" + (active === t ? " active" : "")} onClick={() => onChange(t)}>
            {t.replace("-", " ")}<small>{count}</small>
          </button>
        );
      })}
    </div>
  );
}

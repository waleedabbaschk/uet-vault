import { resources } from "../../data/resources.js";
import { semesters } from "../../data/semesters.js";

export default function Stats() {
  const subjects = semesters.flatMap((s) => s.subjects).length;
  const items = [[subjects, "SUBJECTS"], [resources.length, "FILES"], [6, "RESOURCE TYPES"], ["100%", "FREE"]];
  return (
    <section className="stats">
      {items.map(([n, l]) => (
        <div className="stat" key={l}><b>{n}</b><span>{l}</span></div>
      ))}
    </section>
  );
}


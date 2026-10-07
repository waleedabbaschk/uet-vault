import { Link } from "react-router-dom";
import { semesters } from "../../data/semesters.js";

export default function SubjectsShowcase() {
  const sem = semesters[0];
  return (
    <section className="band" style={{ paddingBottom: 0 }}>
      <h2 className="sec-title">Semester {sem.id} subjects</h2>
      <p className="sec-sub">Jump straight into your subject.</p>
      <div className="grid">
        {sem.subjects.map((s) => (
          <Link className="subj-card" key={s.slug} to={"/semesters/" + sem.id + "/" + s.slug}>
            <span>{s.name}</span><span>&rarr;</span>
          </Link>
        ))}
      </div>
    </section>
  );
}

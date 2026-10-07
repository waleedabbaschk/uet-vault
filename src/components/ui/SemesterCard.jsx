import { Link } from "react-router-dom";

export default function SemesterCard({ semester }) {
  return (
    <div className="sem-card">
      <p className="sem-label">SEMESTER</p>
      <p className="sem-num">{String(semester.id).padStart(2, "0")}</p>
      {semester.subjects.length === 0 ? (
        <p className="soon">Resources coming soon</p>
      ) : (
        <ul className="sem-subjects">
          {semester.subjects.map((s) => (
            <li key={s.slug}>
              <Link to={"/semesters/" + semester.id + "/" + s.slug}>{s.name}</Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

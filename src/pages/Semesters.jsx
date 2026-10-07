import { semesters } from "../data/semesters.js";
import SemesterCard from "../components/ui/SemesterCard.jsx";

export default function Semesters() {
  return (
    <main className="page">
      <h1 className="sec-title">Semesters</h1>
      <p className="sec-sub">Pick your semester, then your subject. Everything is organised the same way.</p>
      <div className="grid">
        {semesters.map((s) => <SemesterCard key={s.id} semester={s} />)}
      </div>
    </main>
  );
}

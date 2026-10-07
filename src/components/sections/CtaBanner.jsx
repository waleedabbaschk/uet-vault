import { Link } from "react-router-dom";

export default function CtaBanner() {
  return (
    <section className="cta">
      <h2>Got notes? Share them.</h2>
      <p>Help the next student. Send your notes, slides or past papers.</p>
      <Link to="/contribute" className="btn btn-light">Contribute</Link>
    </section>
  );
}

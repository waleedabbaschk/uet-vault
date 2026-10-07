import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <main className="page notfound">
      <p className="big404">404</p>
      <h1 className="sec-title">This page took a wrong turn</h1>
      <p className="sec-sub">The page you are looking for does not exist.</p>
      <div className="row">
        <Link to="/" className="btn btn-dark">Go home</Link>
        <Link to="/library" className="btn">Browse library</Link>
      </div>
    </main>
  );
}

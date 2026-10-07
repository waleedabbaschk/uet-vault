import { Link } from "react-router-dom";
import { profile } from "../data/profile.js";

const offers = [
  ["Notes", "Clear, organised notes for each subject."],
  ["Slides", "Lecture slides in one place."],
  ["Books", "Reference books and open material."],
  ["Assignments", "Past assignments to practise from."],
  ["Past papers", "Previous papers to check your preparation."],
];

const next = ["More semesters, added step by step", "More subjects with every upload", "Student contributions through the Contribute page"];

export default function About() {
  return (
    <main className="page about">
      <p className="eyebrow">ABOUT</p>
      <h1 className="sec-title">One tidy place for UET Taxila CS students</h1>
      <p className="lead">
        UET Vault was started by {profile.name}, a {profile.role} student at {profile.university}.
        Study material usually lives in scattered chats, drives and folders. This site puts it in one
        organised structure so any student can preview or download what they need.
      </p>

      <h2 className="sub-title">What you will find</h2>
      <div className="grid">
        {offers.map(([t, d]) => (
          <div className="step" key={t}><h3>{t}</h3><p>{d}</p></div>
        ))}
      </div>

      <h2 className="sub-title">Coming next</h2>
      <ul className="plain-list">
        {next.map((n) => <li key={n}>{n}</li>)}
      </ul>

      <div className="row">
        <Link to="/library" className="btn btn-dark">Browse library</Link>
        <Link to="/contribute" className="btn">Contribute</Link>
        <a className="btn" href={profile.github} target="_blank" rel="noreferrer">GitHub</a>
      </div>
    </main>
  );
}

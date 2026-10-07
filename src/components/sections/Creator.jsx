import { profile } from "../../data/profile.js";

export default function Creator() {
  return (
    <section className="band creator">
      <div className="creator-card">
        <p className="eyebrow">BUILT BY</p>
        <h3>{profile.name}</h3>
        <p>{profile.role}, {profile.university}</p>
      </div>
      <div>
        <h2 className="sec-title">Made by a student, for students</h2>
        <p>
          I started this site so that every UET Taxila CS student can find notes, slides and
          books in one organised place instead of scattered chats and drives.
        </p>
        <div className="row">
          <a className="btn btn-dark" href={profile.github} target="_blank" rel="noreferrer">GitHub</a>
          <a className="btn" href={"mailto:" + profile.email}>Email me</a>
        </div>
      </div>
    </section>
  );
}

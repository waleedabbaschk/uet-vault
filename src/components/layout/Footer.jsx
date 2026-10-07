import { profile } from "../../data/profile.js";

export default function Footer() {
  return (
    <footer className="footer">
      <p>Made by <b>{profile.name}</b> | {profile.role} | {profile.university}</p>
      <p>
        <a href={"mailto:" + profile.email}>{profile.email}</a> |{" "}
        <a href={profile.github} target="_blank" rel="noreferrer">GitHub</a> |{" "}
        <a href={profile.whatsapp} target="_blank" rel="noreferrer">WhatsApp</a>
      </p>
    </footer>
  );
}

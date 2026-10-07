import { useState } from "react";
import { profile } from "../data/profile.js";

export default function Contribute() {
  const [name, setName] = useState("");
  const [type, setType] = useState("notes");
  const [subject, setSubject] = useState("");
  const [link, setLink] = useState("");
  const [msg, setMsg] = useState("");

  const body =
    "Name: " + name + "\nType: " + type + "\nSubject: " + subject + "\nLink: " + link + "\n\n" + msg;
  const mail = "mailto:" + profile.email + "?subject=" + encodeURIComponent("UET Vault contribution: " + subject) + "&body=" + encodeURIComponent(body);
  const wa = profile.whatsapp + "?text=" + encodeURIComponent(body);

  return (
    <main className="page about">
      <p className="eyebrow">CONTRIBUTE</p>
      <h1 className="sec-title">Got notes? Share them.</h1>
      <p className="lead">
        Fill this in and send it by email or WhatsApp. Put your file on Google Drive, set it to
        "anyone with the link can view", and paste the link below.
      </p>

      <div className="form">
        <label className="field">Your name
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" />
        </label>
        <label className="field">What are you sharing?
          <select value={type} onChange={(e) => setType(e.target.value)}>
            <option value="notes">Notes</option>
            <option value="slides">Slides</option>
            <option value="books">Book</option>
            <option value="assignments">Assignment</option>
            <option value="past-papers">Past paper</option>
          </select>
        </label>
        <label className="field">Subject and semester
          <input value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="e.g. Calculus, Semester 1" />
        </label>
        <label className="field">File link (Google Drive)
          <input value={link} onChange={(e) => setLink(e.target.value)} placeholder="https://drive.google.com/..." />
        </label>
        <label className="field">Message (optional)
          <textarea rows="4" value={msg} onChange={(e) => setMsg(e.target.value)} placeholder="Anything we should know?" />
        </label>
        <div className="row">
          <a className="btn btn-dark" href={mail}>Send by email</a>
          <a className="btn" href={wa} target="_blank" rel="noreferrer">Send by WhatsApp</a>
        </div>
        <p className="note">Only share material you are allowed to share. Do not upload copyrighted books you do not have rights to.</p>
      </div>
    </main>
  );
}

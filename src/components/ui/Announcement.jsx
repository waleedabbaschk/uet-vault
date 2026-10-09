import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { announcement as a } from "../../data/announcement.js";
import "../../styles/announcement.css";

const KEY = "uv-ann-" + a.id;

function wasDismissed() {
  try { return localStorage.getItem(KEY) === "1"; } catch (e) { return false; }
}

export default function Announcement() {
  const [open, setOpen] = useState(false);
  const closeRef = useRef(null);

  useEffect(() => {
    let t = 0;
    if (!wasDismissed()) t = window.setTimeout(() => setOpen(true), 350);
    const reopen = () => setOpen(true);
    window.addEventListener("uv-open-update", reopen);
    return () => {
      window.clearTimeout(t);
      window.removeEventListener("uv-open-update", reopen);
    };
  }, []);

  const close = () => {
    setOpen(false);
    try { localStorage.setItem(KEY, "1"); } catch (e) { /* ignore */ }
  };

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e) => { if (e.key === "Escape") close(); };
    window.addEventListener("keydown", onKey);
    if (closeRef.current) closeRef.current.focus();
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className="ann-back" onClick={close} data-lenis-prevent>
      <div
        className="ann"
        role="dialog"
        aria-modal="true"
        aria-labelledby="ann-title"
        onClick={(e) => e.stopPropagation()}
      >
        <button ref={closeRef} className="ann-x" aria-label="Close" onClick={close}>
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round">
            <path d="M5 5l14 14M19 5L5 19" />
          </svg>
        </button>

        <div className="ann-head">
          <span className="ann-pill">{a.label}</span>
          <h2 id="ann-title">{a.title}</h2>
          <p className="ann-intro">{a.intro}</p>
        </div>

        <div className="ann-body" data-lenis-prevent>
          {a.groups.map((g) => (
            <section className="ann-g" key={g.label}>
              <div className="ann-g-top">
                <span className="ann-badge">{g.label}</span>
                {g.by && <span className="ann-by">{g.by}</span>}
              </div>
              <ul>
                {g.lines.map((l) => <li key={l}>{l}</li>)}
              </ul>
              {g.flag && <p className="ann-flag">{g.flag}</p>}
            </section>
          ))}
        </div>

        <div className="ann-foot">
          <p>{a.footer}</p>
          <div className="ann-actions">
            <Link to="/assignments" className="btn btn-dark" onClick={close}>Open assignments</Link>
            <button className="btn" onClick={close}>Got it</button>
          </div>
        </div>
      </div>
    </div>
  );
}
import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import RainCanvas from "../effects/RainCanvas.jsx";
import cutout from "../../assets/images/waleed-cutout.png";
import { profile } from "../../data/profile.js";

export default function Hero() {
  const [rain, setRain] = useState(50);
  const [on, setOn] = useState(true);
  const root = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".hero-word", { yPercent: 110, duration: 1, stagger: 0.15, ease: "power4.out" });
      gsap.from(".hero-img", { y: 80, opacity: 0, duration: 1.2, ease: "power3.out" });
      gsap.from(".hero-fade", { opacity: 0, y: 20, duration: 0.8, delay: 0.7, stagger: 0.1 });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section className="hero" ref={root}>
      <h1 className="hero-title">
        <span className="hero-line"><span className="hero-word">never</span></span>
        <span className="hero-line"><span className="hero-word">stop</span></span>
        <span className="hero-line"><span className="hero-word">learn<span className="acc">ing</span></span></span>
      </h1>

      <img className="hero-img" src={cutout} alt={profile.name} />
      <RainCanvas intensity={rain} enabled={on} />

      <div className="rain-panel hero-fade">
        <label>Rain intensity <b>{rain}%</b></label>
        <input type="range" min="0" max="100" value={rain} onChange={(e) => setRain(Number(e.target.value))} />
        <button onClick={() => setOn(!on)}>{on ? "Rain: ON" : "Rain: OFF"}</button>
      </div>

      <div className="hero-info hero-fade">
        <p className="eyebrow">UET TAXILA | BS COMPUTER SCIENCE</p>
        <h2>Every note, slide and book. One place.</h2>
        <p>Free resources for CS students, built by {profile.name} (Semester 1). Preview online or download.</p>
      </div>

      <div className="hero-cta hero-fade">
        <Link to="/library" className="btn btn-light">Browse library</Link>
        <Link to="/semesters" className="btn btn-ghost">Semesters</Link>
      </div>
    </section>
  );
}

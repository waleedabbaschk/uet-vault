import { useEffect, useRef, useState } from "react";
import cutout from "../../assets/images/waleed-cutout.png";
import "../../styles/loader.css";

const LETTERS = "UETVAULT".split("");
const FACES = ["U", "E", "T", "V", "A", "L"];

export default function Loader({ onReveal, onDone }) {
  const [pct, setPct] = useState(0);
  const [out, setOut] = useState(false);
  const imgReady = useRef(false);
  const startedAt = useRef(performance.now());

  useEffect(() => {
    const reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const MIN_MS = reduce ? 700 : 2800;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const img = new Image();
    img.onload = () => { imgReady.current = true; };
    img.onerror = () => { imgReady.current = true; };
    img.src = cutout;

    let raf = 0;
    let finished = false;
    let timer = 0;

    const tick = (now) => {
      const t = now - startedAt.current;
      if (t > 7000) imgReady.current = true;
      let target = Math.min(t / MIN_MS, 1);
      if (!imgReady.current) target = Math.min(target, 0.92);
      const eased = 1 - Math.pow(1 - target, 2);
      setPct(Math.round(eased * 100));
      if (target >= 1 && !finished) {
        finished = true;
        setOut(true);
        onReveal();
        timer = window.setTimeout(onDone, 950);
        return;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(timer);
      document.body.style.overflow = prevOverflow;
    };
  }, []);

  return (
    <div className={"ldr" + (out ? " out" : "")} role="status" aria-label="Loading UET Vault">
      <div className="ldr-grid" />
      <div className="ldr-scene">
        <div className="ldr-float">
          <div className="ldr-ring r1"><i /></div>
          <div className="ldr-ring r2"><i /></div>
          <div className="ldr-ring r3"><i /></div>
          <div className="ldr-cube">
            {FACES.map((f, i) => (
              <div key={i} className={"face f" + i}>{f}</div>
            ))}
          </div>
        </div>
        <div className="ldr-shadow" />
      </div>
      <h1 className="ldr-word">
        {LETTERS.map((l, i) => (
          <span key={i} style={{ "--i": i }} className={i >= 3 ? "dim" : ""}>{l}</span>
        ))}
      </h1>
      <p className="ldr-sub">Notes / Slides / Books</p>
      <div className="ldr-bar"><b style={{ width: pct + "%" }} /></div>
      <p className="ldr-pct">{pct}%</p>
    </div>
  );
}
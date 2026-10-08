import { useEffect, useRef, useState } from "react";
import cutout from "../../assets/images/waleed-cutout.png";
import "../../styles/loader.css";

const VW = 440;
const GY = 522; // ground line
const TX = 92; // writing box left
const TY = 318; // writing box top
const SX = 36; // right shoulder x (from body centre)
const SY = -186; // shoulder y (from feet)
const L1 = 52; // upper arm
const L2 = 50; // forearm
const SPEED = 285; // ink speed, px per second

// "UET Taxila" written stroke by stroke (box is about 320 x 64)
const STROKES = [
  "M3,3 C2,22 1,44 8,54 C16,64 29,58 31,40 C32,28 32,14 33,2",
  "M72,4 C62,1 50,2 43,4 C41,22 41,42 44,58 C54,60 64,58 73,57",
  "M44,31 C51,29 58,30 64,31",
  "M82,4 C94,1 108,2 121,4",
  "M101,3 C100,22 101,42 100,58",
  "M150,4 C162,1 176,2 189,4",
  "M169,3 C168,22 169,42 168,58",
  "M214,32 C205,24 193,29 192,43 C191,56 205,63 213,52",
  "M214,26 C215,38 214,50 217,58",
  "M228,27 C234,37 241,48 247,58",
  "M247,26 C240,38 233,50 227,60",
  "M262,28 C262,38 261,50 264,58",
  "M263,11 L263,12",
  "M278,3 C277,22 276,42 279,58",
  "M312,32 C303,24 291,29 290,43 C289,56 303,63 311,52",
  "M312,26 C313,38 312,50 315,58",
];

const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const ease = (k) => k * k * (3 - 2 * k);

export default function Loader({ onReveal, onDone }) {
  const [out, setOut] = useState(false);
  const [waiting, setWaiting] = useState(false);
  const skipRef = useRef(() => {});

  const R = useRef({});
  const ink = useRef([]);
  const set = (name) => (el) => { R.current[name] = el; };

  useEffect(() => {
    const reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    let imgReady = false;
    const img = new Image();
    img.onload = () => { imgReady = true; };
    img.onerror = () => { imgReady = true; };
    img.src = cutout;

    const paths = ink.current.filter(Boolean);
    const lens = paths.map((p) => p.getTotalLength());
    const starts = paths.map((p) => p.getPointAtLength(0));
    const ends = paths.map((p, i) => p.getPointAtLength(lens[i]));
    paths.forEach((p, i) => {
      p.style.strokeDasharray = String(lens[i] + 1);
      p.style.strokeDashoffset = String(lens[i] + 1);
      p.style.visibility = "hidden";
    });

    // timeline
    const segs = [];
    let time = 0.6;
    let prev = null;
    paths.forEach((p, i) => {
      const s = starts[i];
      if (prev) {
        const d = Math.hypot(s.x - prev.x, s.y - prev.y);
        const dur = Math.max(0.1, d / 700);
        segs.push({ type: "move", t0: time, t1: time + dur, a: prev, b: s });
        time += dur;
      }
      const sp = SPEED;
      const dur = Math.max(0.09, lens[i] / sp);
      segs.push({ type: "write", i, t0: time, t1: time + dur, len: lens[i] });
      time += dur;
      prev = ends[i];
    });
    const writeEnd = time;
    const lastEnd = { x: TX + ends[ends.length - 1].x, y: TY + ends[ends.length - 1].y };

    const st = { bx: TX - 34, phase: 0 };
    let start = performance.now();
    let last = start;
    let raf = 0;
    let timer = 0;
    let finished = false;
    let waitShown = false;

    if (reduce) start -= (writeEnd + 0.6) * 1000;

    const reveal = () => {
      if (finished) return;
      finished = true;
      setOut(true);
      onReveal();
      timer = window.setTimeout(onDone, 1000);
    };

    skipRef.current = () => {
      start = performance.now() - (writeEnd + 0.95) * 1000;
    };

    const frame = (now) => {
      const t = (now - start) / 1000;
      const dt = clamp((now - last) / 1000, 0.001, 0.05);
      last = now;
      const r = R.current;

      // ---- pen tip + ink
      let tip = { x: TX + starts[0].x, y: TY + starts[0].y - 14 };
      let down = false;
      for (const s of segs) {
        if (s.type === "write") {
          const k = clamp((t - s.t0) / (s.t1 - s.t0), 0, 1);
          const el = paths[s.i];
          el.style.strokeDashoffset = String((s.len + 1) * (1 - k));
          el.style.visibility = k > 0 ? "visible" : "hidden";
          if (t >= s.t0 && t <= s.t1) {
            const pt = el.getPointAtLength(s.len * k);
            tip = { x: TX + pt.x, y: TY + pt.y };
            down = true;
          } else if (t > s.t1) {
            tip = { x: TX + ends[s.i].x, y: TY + ends[s.i].y };
          }
        } else if (t >= s.t0 && t <= s.t1) {
          const k = ease((t - s.t0) / (s.t1 - s.t0));
          tip = {
            x: TX + s.a.x + (s.b.x - s.a.x) * k,
            y: TY + s.a.y + (s.b.y - s.a.y) * k - Math.sin(k * Math.PI) * 9,
          };
        }
      }
      let hop = 0;
      if (t > writeEnd) {
        tip = { x: lastEnd.x, y: lastEnd.y - Math.min((t - writeEnd) * 60, 26) };
        const k = (t - writeEnd - 0.1) / 0.7;
        if (k > 0 && k < 1) hop = Math.abs(Math.sin(k * Math.PI * 2)) * 13;
      }

      // ---- body follows the pen
      const target = clamp(tip.x - 34, 56, 376);
      const before = st.bx;
      st.bx += (target - st.bx) * Math.min(1, dt * 9);
      const moved = st.bx - before;
      st.phase += Math.abs(moved) * 0.2;
      const speed = Math.abs(moved) / dt;
      const swing = Math.sin(st.phase) * clamp(speed / 55, 0, 1) * 9;
      const bob = Math.abs(Math.sin(st.phase)) * clamp(speed / 55, 0, 1) * 2 + Math.sin(t * 2.4) * 0.8 + hop;
      const gy = GY - bob;

      r.char.setAttribute("transform", `translate(${st.bx.toFixed(2)} ${gy.toFixed(2)})`);
      r.legL.setAttribute("transform", `rotate(${swing.toFixed(2)} -14 -105)`);
      r.legR.setAttribute("transform", `rotate(${(-swing).toFixed(2)} 14 -105)`);
      r.armL.setAttribute("transform", `rotate(${(Math.sin(t * 2) * 2 + swing * 0.35).toFixed(2)} -37 -186)`);
      const look = clamp((tip.x - st.bx) / 110, -1, 1) * 5 + (down ? Math.sin(t * 9) * 0.8 : 0);
      r.head.setAttribute("transform", `rotate(${look.toFixed(2)} 0 -215)`);
      r.shadow.setAttribute("cx", st.bx.toFixed(2));
      r.shadow.setAttribute("rx", (54 - hop * 0.8).toFixed(2));

      // ---- right arm (two bone IK)
      const sh = { x: st.bx + SX, y: gy + SY };
      let hand = { x: tip.x + 10, y: tip.y + 24 };
      let dx = hand.x - sh.x;
      let dy = hand.y - sh.y;
      let d = Math.hypot(dx, dy);
      const maxD = L1 + L2 - 0.6;
      if (d > maxD) {
        hand = { x: sh.x + (dx * maxD) / d, y: sh.y + (dy * maxD) / d };
        dx = hand.x - sh.x;
        dy = hand.y - sh.y;
        d = maxD;
      }
      d = Math.max(d, 22);
      const base = Math.atan2(dy, dx);
      const a = Math.acos(clamp((L1 * L1 + d * d - L2 * L2) / (2 * L1 * d), -1, 1));
      const e1 = { x: sh.x + Math.cos(base + a) * L1, y: sh.y + Math.sin(base + a) * L1 };
      const e2 = { x: sh.x + Math.cos(base - a) * L1, y: sh.y + Math.sin(base - a) * L1 };
      const score = (e) => e.y + e.x * 0.3;
      const el = score(e1) > score(e2) ? e1 : e2;
      const arm = `M${sh.x.toFixed(1)},${sh.y.toFixed(1)} L${el.x.toFixed(1)},${el.y.toFixed(1)} L${hand.x.toFixed(1)},${hand.y.toFixed(1)}`;
      r.armO.setAttribute("d", arm);
      r.armI.setAttribute("d", arm);
      r.hand.setAttribute("cx", hand.x.toFixed(1));
      r.hand.setAttribute("cy", hand.y.toFixed(1));
      r.pen.setAttribute("x1", tip.x.toFixed(1));
      r.pen.setAttribute("y1", tip.y.toFixed(1));
      r.pen.setAttribute("x2", (tip.x + 15).toFixed(1));
      r.pen.setAttribute("y2", (tip.y + 36).toFixed(1));
      r.glow.setAttribute("cx", tip.x.toFixed(1));
      r.glow.setAttribute("cy", tip.y.toFixed(1));
      r.glow.style.opacity = down ? "1" : "0";

      // ---- finish
      if (t > writeEnd + 0.9 && !imgReady && !waitShown) {
        waitShown = true;
        setWaiting(true);
      }
      if (t > writeEnd + 0.9 && (imgReady || t > writeEnd + 6)) {
        reveal();
        return;
      }
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(timer);
      document.body.style.overflow = prevOverflow;
    };
  }, []);

  return (
    <div
      className={"ldr" + (out ? " out" : "")}
      role="status"
      aria-label="Loading UET Vault"
      onClick={() => skipRef.current()}
    >
      <div className="ldr-half top" />
      <div className="ldr-half bot" />
      <div className="ldr-stage">
        <svg className="ldr-svg" viewBox={"0 200 " + VW + " 350"} preserveAspectRatio="xMidYMid meet" aria-hidden="true">
          <defs>
            <linearGradient id="ldrLens" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#10202b" />
              <stop offset="0.55" stopColor="#1d5a78" />
              <stop offset="1" stopColor="#0c141a" />
            </linearGradient>
          </defs>

          <ellipse ref={set("shadow")} cx="60" cy={GY + 3} rx="54" ry="8" fill="rgba(0,0,0,.28)" />

          <g className="ldr-in">
            <g ref={set("char")}>
              {/* back arm */}
              <g ref={set("armL")} strokeLinecap="round" strokeLinejoin="round" fill="none">
                <path d="M-37,-186 L-46,-142 L-44,-106" stroke="#2c2c33" strokeWidth="23" />
                <path d="M-37,-186 L-46,-142 L-44,-106" stroke="#131316" strokeWidth="19" />
                <circle cx="-44" cy="-98" r="9" fill="#e9bb92" stroke="none" />
              </g>

              {/* legs */}
              <g ref={set("legL")}>
                <rect x="-25" y="-106" width="22" height="94" rx="9" fill="#2b2b33" />
                <rect x="-31" y="-16" width="34" height="16" rx="7" fill="#f4f4f4" />
                <rect x="-31" y="-4" width="34" height="4" rx="2" fill="#ff3d00" />
              </g>
              <g ref={set("legR")}>
                <rect x="3" y="-106" width="22" height="94" rx="9" fill="#2b2b33" />
                <rect x="-3" y="-16" width="34" height="16" rx="7" fill="#f4f4f4" />
                <rect x="-3" y="-4" width="34" height="4" rx="2" fill="#ff3d00" />
              </g>

              {/* jacket */}
              <path d="M-37,-190 Q-37,-199 -28,-200 L28,-200 Q37,-199 37,-190 L41,-104 Q41,-95 32,-95 L-32,-95 Q-41,-95 -41,-104 Z" fill="#131316" />
              <path d="M-37,-190 Q-37,-199 -28,-200 L-6,-200 L-9,-168 L-39,-166 Z" fill="#24242a" />
              <path d="M37,-190 Q37,-199 28,-200 L6,-200 L9,-168 L39,-166 Z" fill="#24242a" />
              <path d="M0,-200 L0,-95" stroke="#3b3b43" strokeWidth="2" fill="none" />
              <path d="M-31,-128 L-12,-128 M12,-128 L31,-128" stroke="#33333a" strokeWidth="2.5" strokeLinecap="round" fill="none" />
              <rect x="14" y="-168" width="15" height="15" rx="2" fill="#ff3d00" />
              <text x="21.5" y="-156.2" textAnchor="middle" fontSize="11" fontWeight="800" fontFamily="Arial,sans-serif" fill="#fff">U</text>
              <path d="M-22,-200 L-24,-132 M22,-200 L24,-132" stroke="#2a2a30" strokeWidth="4" strokeLinecap="round" fill="none" />

              {/* hood collar + gaiter */}
              <path d="M-31,-200 Q0,-224 31,-200 Q0,-186 -31,-200 Z" fill="#1f1f24" />
              <path d="M-23,-232 Q0,-224 23,-232 L28,-203 Q0,-193 -28,-203 Z" fill="#0b0b0d" />
              <path d="M-22,-218 Q0,-211 22,-218 M-24,-208 Q0,-201 24,-208" stroke="#25252b" strokeWidth="2" fill="none" />

              {/* head */}
              <g ref={set("head")}>
               <g transform="translate(0 -215)">
                <circle cx="-34" cy="-24" r="7" fill="#d9a67c" />
                <circle cx="34" cy="-24" r="7" fill="#d9a67c" />
                <circle cx="0" cy="-28" r="33" fill="#e9bb92" />
                <path d="M-32,-18 Q0,-8 32,-18 Q35,3 20,9 Q0,17 -20,9 Q-35,3 -32,-18 Z" fill="#0b0b0d" />
                <path d="M-26,-6 Q0,2 26,-6" stroke="#25252b" strokeWidth="2" fill="none" />
                <rect x="-37" y="-43" width="74" height="20" rx="8" fill="#0b0b0d" />
                <rect x="-31" y="-48" width="62" height="27" rx="12" fill="#17171b" stroke="#000" strokeWidth="1.5" />
                <rect x="-27" y="-44" width="54" height="19" rx="9" fill="url(#ldrLens)" />
                <path d="M-18,-43 L-8,-43 L-16,-26 L-26,-26 Z" fill="#fff" opacity="0.28" />
                <path d="M6,-43 L11,-43 L5,-26 L0,-26 Z" fill="#fff" opacity="0.18" />
                <path d="M-36,-62 C-40,-48 -30,-68 -2,-67 C22,-68 40,-52 36,-34 C33,-46 27,-50 21,-51 C17,-44 9,-48 5,-52 C-1,-46 -9,-50 -15,-51 C-24,-48 -31,-42 -36,-34 Z" fill="#0b0b0d" />
                <path d="M-14,-66 L-9,-76 L-4,-67 M4,-67 L11,-77 L15,-66 M20,-63 L28,-70 L28,-59" stroke="#0b0b0d" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
               </g>
              </g>
            </g>

            {/* writing arm, pen and hand */}
            <g strokeLinecap="round" strokeLinejoin="round" fill="none">
              <path ref={set("armO")} d="M0,0 L0,0" stroke="#2c2c33" strokeWidth="23" />
              <path ref={set("armI")} d="M0,0 L0,0" stroke="#131316" strokeWidth="19" />
              <line ref={set("pen")} x1="0" y1="0" x2="0" y2="0" stroke="#0b0b0d" strokeWidth="7" />
              <circle ref={set("hand")} cx="0" cy="0" r="9.5" fill="#e9bb92" stroke="none" />
            </g>
          </g>

          {/* ink */}
          <g transform={"translate(" + TX + "," + TY + ")"} fill="none" stroke="#fff" strokeWidth="5.5" strokeLinecap="round" strokeLinejoin="round">
            {STROKES.map((d, i) => (
              <path key={i} ref={(el) => { ink.current[i] = el; }} d={d} />
            ))}
          </g>
          <circle ref={set("glow")} cx="0" cy="0" r="6" fill="#19c9f2" style={{ opacity: 0, filter: "drop-shadow(0 0 6px #19c9f2)" }} />
        </svg>
        {waiting && <p className="ldr-wait">Almost there...</p>}
        <p className="ldr-skip">Tap to skip</p>
      </div>
    </div>
  );
}
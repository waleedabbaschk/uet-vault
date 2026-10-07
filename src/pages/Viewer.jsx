import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import * as pdfjs from "pdfjs-dist/legacy/build/pdf.mjs";
import "../styles/viewer.css";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/legacy/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

function Page({ pdf, num, width, ratio }) {
  const wrap = useRef(null);
  const canvas = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const io = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVisible(true); },
      { rootMargin: "400px 0px" }
    );
    io.observe(wrap.current);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!visible || !width) return;
    let task = null;
    let dead = false;
    (async () => {
      try {
        const page = await pdf.getPage(num);
        if (dead) return;
        const base = page.getViewport({ scale: 1 });
        const scale = width / base.width;
        const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
        const vp = page.getViewport({ scale: scale * dpr });
        const c = canvas.current;
        if (!c) return;
        c.width = vp.width;
        c.height = vp.height;
        c.style.width = width + "px";
        c.style.height = vp.height / dpr + "px";
        task = page.render({ canvasContext: c.getContext("2d"), viewport: vp });
        await task.promise;
      } catch (e) {
        /* cancelled or destroyed */
      }
    })();
    return () => { dead = true; if (task) task.cancel(); };
  }, [visible, pdf, num, width]);

  return (
    <div ref={wrap} className="v-page" style={{ width, minHeight: Math.round(width * ratio) }}>
      <canvas ref={canvas} />
      <span className="v-num">{num}</span>
    </div>
  );
}

export default function Viewer() {
  const [sp] = useSearchParams();
  const navigate = useNavigate();
  const file = sp.get("file") || "";
  const title = sp.get("title") || "Document";
  const holder = useRef(null);
  const [pdf, setPdf] = useState(null);
  const [ratio, setRatio] = useState(1.4);
  const [width, setWidth] = useState(0);
  const [err, setErr] = useState("");
  const [pct, setPct] = useState(0);

  useEffect(() => {
    const measure = () => {
      if (holder.current) setWidth(Math.min(holder.current.clientWidth, 900));
    };
    measure();
    let t;
    const on = () => { clearTimeout(t); t = setTimeout(measure, 200); };
    window.addEventListener("resize", on);
    return () => { window.removeEventListener("resize", on); clearTimeout(t); };
  }, []);

  useEffect(() => {
    if (!file.startsWith("/files/")) { setErr("This file cannot be opened here."); return; }
    let cancelled = false;
    setPdf(null);
    setErr("");
    setPct(0);
    const task = pdfjs.getDocument({
      url: file,
      disableAutoFetch: true,
      disableStream: false,
      rangeChunkSize: 262144,
    });
    task.onProgress = (p) => {
      if (!cancelled && p.total) setPct(Math.round((p.loaded / p.total) * 100));
    };
    task.promise
      .then(async (d) => {
        if (cancelled) return;
        setPdf(d);
        try {
          const p1 = await d.getPage(1);
          const v = p1.getViewport({ scale: 1 });
          if (!cancelled) setRatio(v.height / v.width);
        } catch (e) { /* keep default ratio */ }
      })
      .catch(() => {
        if (!cancelled) setErr("Could not open this PDF. Try the Download button.");
      });
    return () => { cancelled = true; task.destroy(); };
  }, [file]);

  return (
    <main className="viewer">
      <div className="v-bar">
        <button className="btn v-back" onClick={() => navigate(-1)}>Back</button>
        <p className="v-title">{title}</p>
        <a className="btn btn-light" href={file} download>Download</a>
      </div>
      <div className="v-holder" ref={holder}>
        {err && (
          <div className="v-msg">
            <p>{err}</p>
            <Link to="/library" className="btn btn-light">Library</Link>
          </div>
        )}
        {!err && !pdf && <p className="v-msg">Loading... {pct ? pct + "%" : ""}</p>}
        {pdf && width > 0 &&
          Array.from({ length: pdf.numPages }, (_, i) => i + 1).map((n) => (
            <Page key={n + "-" + width} pdf={pdf} num={n} width={width} ratio={ratio} />
          ))}
      </div>
    </main>
  );
}

import { useEffect, useRef } from "react";

export default function RainCanvas({ intensity = 50, enabled = true }) {
  const ref = useRef(null);
  const level = useRef(intensity);
  level.current = intensity;

  useEffect(() => {
    const c = ref.current;
    const ctx = c.getContext("2d");
    let w = 0, h = 0, id;
    let drops = [];
    const resize = () => {
      w = c.width = c.offsetWidth;
      h = c.height = c.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);
    ctx.clearRect(0, 0, w, h);

    const loop = () => {
      ctx.clearRect(0, 0, w, h);
      const target = Math.floor(level.current * 4);
      while (drops.length < target) {
        drops.push({ x: Math.random() * w, y: Math.random() * h, l: 10 + Math.random() * 18, s: 12 + Math.random() * 10 });
      }
      if (drops.length > target) drops.length = target;
      ctx.strokeStyle = "rgba(255,255,255,0.4)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (const d of drops) {
        ctx.moveTo(d.x, d.y);
        ctx.lineTo(d.x - 2, d.y + d.l);
        d.y += d.s;
        d.x -= 0.6;
        if (d.y > h) { d.y = -20; d.x = Math.random() * w; }
      }
      ctx.stroke();
      id = requestAnimationFrame(loop);
    };
    if (enabled) loop();

    return () => {
      cancelAnimationFrame(id);
      window.removeEventListener("resize", resize);
    };
  }, [enabled]);

  return <canvas ref={ref} className="rain" />;
}

import { useEffect, useRef } from 'react';

// Full-hero DNA helix. Its rungs are the actual bases of the sequence being typed,
// and it flares whenever a note plays.
export default function Helix({ bases, pos }) {
  const ref = useRef(null);
  const live = useRef({ bases, pos, hit: 0 });
  if (live.current.pos !== pos) live.current.hit = performance.now();
  live.current.bases = bases; live.current.pos = pos;

  useEffect(() => {
    const cv = ref.current, ctx = cv.getContext('2d');
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let w = 0, h = 0, raf = 0;
    const size = () => {
      const dpr = window.devicePixelRatio || 1, r = cv.getBoundingClientRect();
      w = r.width; h = r.height; cv.width = w * dpr; cv.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    const draw = (t) => {
      const { bases: b, pos: p, hit } = live.current;
      const cs = getComputedStyle(document.documentElement);
      const col = { A: '--base-a', T: '--base-t', C: '--base-c', G: '--base-g' };
      const pal = Object.fromEntries(Object.entries(col).map(([k, v]) => [k, cs.getPropertyValue(v).trim()]));
      const comp = { A: 'T', T: 'A', C: 'G', G: 'C' };
      const boost = p >= 0 ? Math.max(0, 1 - (performance.now() - hit) / 350) : 0;
      const step = 16, n = Math.ceil(w / step), mid = h * 0.52;
      ctx.clearRect(0, 0, w, h); ctx.lineWidth = 2.5; ctx.lineCap = 'round';
      for (let i = 0; i < n; i++) {
        const base = b.length ? b[i % b.length] : 'A';
        const x = i * step + step / 2, ph = i * 0.3 - t / 800;
        const amp = h * 0.3 * (0.4 + 0.6 * Math.abs(Math.sin(i * 0.07 + t / 1700)));
        const s = Math.sin(ph), depth = (Math.cos(ph) + 1) / 2;
        const lit = p >= 0 && i % b.length === p;
        const a = amp * (1 + (lit ? 0.35 : 0) + boost * 0.12);
        const y1 = mid + s * a, y2 = mid - s * a;
        ctx.strokeStyle = pal[base]; ctx.globalAlpha = (0.25 + 0.35 * depth) * (lit ? 2 : 1);
        ctx.beginPath(); ctx.moveTo(x, y1); ctx.lineTo(x, y2); ctx.stroke();
        ctx.globalAlpha = 0.5 + 0.5 * depth;
        const r = 2.5 + depth * 2 + (lit ? 5 : 0);
        ctx.fillStyle = pal[base]; ctx.beginPath(); ctx.arc(x, y1, r, 0, 6.283); ctx.fill();
        ctx.fillStyle = pal[comp[base]]; ctx.beginPath(); ctx.arc(x, y2, 2.5 + (1 - depth) * 2 + (lit ? 5 : 0), 0, 6.283); ctx.fill();
      }
    };
    const loop = (t) => { if (cv.getBoundingClientRect().bottom > 0) draw(t); raf = requestAnimationFrame(loop); };
    size(); window.addEventListener('resize', size);
    if (reduce) draw(0); else raf = requestAnimationFrame(loop);
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', size); };
  }, []);

  return <canvas ref={ref} className="helix" aria-hidden="true" />;
}

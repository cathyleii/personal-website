import { useEffect, useMemo, useRef, useState } from 'react';
import { encode, noteOf } from '../lib/dna.js';
import { tone } from '../lib/audio.js';

const COLOR = { A: 'var(--base-a)', T: 'var(--base-t)', C: 'var(--base-c)', G: 'var(--base-g)' };
const X0 = 34, DX = 22, Y0 = 96, DY = 6; // layout: staff step 0 (C4) sits at Y0

// Your name, translated to DNA, written on a staff, playable.
export default function Sequencer({ initial }) {
  const [text, setText] = useState(initial);
  const [pos, setPos] = useState(-1);
  const timer = useRef(0);
  const bases = useMemo(() => encode(text), [text]);
  useEffect(() => () => clearTimeout(timer.current), []);

  const play = () => {
    clearTimeout(timer.current);
    let i = 0;
    const next = () => {
      if (i >= bases.length) { setPos(-1); return; }
      setPos(i); tone(noteOf(bases[i], i).freq);
      i++; timer.current = setTimeout(next, 170);
    };
    next();
  };

  const W = X0 * 2 + bases.length * DX;
  return (
    <div className="seqbox">
      <div className="seqhead">
        <label>
          <span className="mvt">Sequence a name</span>
          <input value={text} maxLength={12} onChange={e => { clearTimeout(timer.current); setPos(-1); setText(e.target.value); }} />
        </label>
        <button type="button" className="btn primary" onClick={play}>&#9654; Play {bases.length} bases</button>
      </div>
      <div className="seqscroll">
        <svg width={W} height="124" viewBox={`0 0 ${W} 124`} role="img"
             aria-label={`${text} written as ${bases.length} DNA bases on a musical staff`}>
          {[2, 4, 6, 8, 10].map(s => (
            <line key={s} x1="8" x2={W - 8} y1={Y0 - s * DY} y2={Y0 - s * DY} stroke="var(--ink)" strokeOpacity=".45" />
          ))}
          {bases.map((b, i) => {
            const { step } = noteOf(b, i), x = X0 + i * DX, y = Y0 - step * DY, on = i === pos;
            return (
              <g key={i}>
                {i % 4 === 0 && <text x={x - 8} y="16" className="seqchar">{text[i / 4] === ' ' ? '\u00B7' : text[i / 4]}</text>}
                {i % 4 === 3 && <line x1={x + DX / 2} x2={x + DX / 2} y1={Y0 - 60} y2={Y0 - 12} stroke="var(--line)" />}
                {(step === 0 || step === 12) && <line x1={x - 10} x2={x + 10} y1={y} y2={y} stroke="var(--ink)" strokeOpacity=".45" />}
                <circle cx={x} cy={y} r={on ? 9 : 6.5} fill={COLOR[b]} className="seqnote" />
                <text x={x} y="118" textAnchor="middle" className="seqbase" fill={COLOR[b]}>{b}</text>
              </g>
            );
          })}
        </svg>
      </div>
      <p className="seqnote-cap">Each letter is 4 bases (2 bits apiece): A, C, G, T become the notes C, E, G, A. Type a name and press play.</p>
    </div>
  );
}

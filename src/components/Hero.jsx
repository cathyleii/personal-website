import { useMemo, useState } from 'react';
import Helix from './Helix.jsx';
import Sequencer from './Sequencer.jsx';
import { encode } from '../lib/dna.js';

const GLYPHS = ['\u266A', 'A', '\u266B', 'T', '\u2669', 'C', '\u266C', 'G'];

function Floaters() {
  return Array.from({ length: 14 }, (_, k) => (
    <span key={k} className="float" aria-hidden="true"
      style={{
        left: `${4 + (k * 7) % 92}%`,
        fontSize: `${1.1 + (k % 4) * 0.5}rem`,
        '--d': `${10 + (k % 5) * 2.5}s`,
        '--delay': `${-k * 1.3}s`,
      }}>
      {GLYPHS[k % GLYPHS.length]}
    </span>
  ));
}

export default function Hero({ site, sound, setSound }) {
  const [text, setText] = useState(site.name);
  const [pos, setPos] = useState(-1);
  const bases = useMemo(() => encode(text), [text]);

  return (
    <header className="hero">
      <Helix bases={bases} pos={pos} />
      <Floaters />
      <div className="wrap">
        <h1>{site.name}</h1>
        <p className="lead" dangerouslySetInnerHTML={{ __html: site.intro }} />
        <div className="links">
          <a className="btn primary" href={`mailto:${site.email}`}>Email me</a>
          <a className="btn" href={site.github}>GitHub</a>
          <a className="btn" href="#projects">See my projects</a>
          <button className="btn sound" type="button" aria-pressed={sound}
                  onClick={() => setSound(s => !s)}>
            &#9835; Sound: {sound ? 'on' : 'off'}
          </button>
        </div>
        <Sequencer text={text} setText={setText} bases={bases} pos={pos} setPos={setPos} />
      </div>
    </header>
  );
}

import { useEffect, useState } from 'react';
import SITE from './data/content.js';
import Hero from './components/Hero.jsx';
import PianoNav from './components/PianoNav.jsx';
import { About, Projects, Experience, Skills, Contact } from './components/Sections.jsx';

export default function App() {
  const [sound, setSound] = useState(true);
  useEffect(() => {
    const on = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      document.documentElement.style.setProperty('--p', max > 0 ? window.scrollY / max : 0);
    };
    on();
    window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, []);
  return (
    <>
      <div className="progress" aria-hidden="true" />
      <Hero site={SITE} sound={sound} setSound={setSound} />
      <PianoNav sound={sound} />
      <main className="wrap">
        <About site={SITE} />
        <Projects items={SITE.projects} />
        <Experience site={SITE} />
        <Skills site={SITE} />
        <Contact site={SITE} />
      </main>
      <footer>
        <div className="wrap">&copy; {new Date().getFullYear()} {SITE.name}</div>
      </footer>
    </>
  );
}

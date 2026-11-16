import Reveal from './Reveal.jsx';
import SeqStrip from './SeqStrip.jsx';

const Head = ({ mvt, children }) => (
  <Reveal as="h2"><span className="mvt">{mvt}</span>{children}</Reveal>
);

const Bullets = ({ items }) => <ul>{items.map((b, i) => <li key={i}>{b}</li>)}</ul>;

export function About({ site }) {
  return (
    <section id="about">
      <Head mvt="I · Andante">About</Head>
      <div className="about">
        <div>
          {site.about.map((p, i) => <Reveal as="p" key={i} delay={i * 70}>{p}</Reveal>)}
        </div>
        <div>
          <Reveal className="fact">
            <h3>Education</h3>
            <p>{site.education.degree}</p>
            <p>{site.education.school}</p>
            <p>{site.education.graduation}</p>
          </Reveal>
          <Reveal className="fact" delay={70}>
            <h3>Based in</h3>
            <p>{site.location}</p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

export function Projects({ items }) {
  return (
    <section id="projects">
      <Head mvt="II · Allegro">Projects</Head>
      <div>
        {items.map(p => (
          <Reveal as="article" className="project" key={p.title}>
            <div className="when">{p.when}{p.kind && <><br />{p.kind}</>}</div>
            <div>
              <h3>{p.title}</h3>
              <p className="stack">{p.stack}</p>
              <SeqStrip text={p.title} />
              <Bullets items={p.bullets} />
              {p.link && <a className="demo" href={p.link.url}>{p.link.label}</a>}
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function Jobs({ items }) {
  return items.map(j => (
    <Reveal as="article" className="job" key={j.title + j.when}>
      <div className="when">{j.when}</div>
      <div>
        <h3>{j.title}</h3>
        {j.org && <p className="org">{j.org}</p>}
        <Bullets items={j.bullets} />
      </div>
    </Reveal>
  ));
}

export function Experience({ site }) {
  return (
    <section id="experience">
      <Head mvt="III · Moderato">Experience</Head>
      <div><Jobs items={site.experience} /></div>
      {site.volunteer?.length > 0 && (
        <>
          <p className="sub">Volunteer</p>
          <div id="volunteer-list"><Jobs items={site.volunteer} /></div>
        </>
      )}
    </section>
  );
}

export function Skills({ site }) {
  return (
    <section id="skills">
      <Head mvt="IV · Scherzo">Skills and coursework</Head>
      <ul className="skills">
        {site.skills.map((s, i) => <Reveal as="li" key={s} delay={(i % 4) * 70}>{s}</Reveal>)}
      </ul>
      <ul className="courses">
        {site.courses.map((c, i) => <Reveal as="li" key={c} delay={(i % 4) * 70}>{c}</Reveal>)}
      </ul>
    </section>
  );
}

export function Contact({ site }) {
  return (
    <section id="contact" className="contact">
      <Head mvt="V · Coda">Contact</Head>
      <Reveal as="p">Looking for a collaborator, or want to talk about a project? Send me a note.</Reveal>
      <Reveal as="p" className="big"><a href={`mailto:${site.email}`}>{site.email}</a></Reveal>
      <Reveal as="p"><a href={site.github}>{site.githubLabel}</a></Reveal>
    </section>
  );
}

import { useState } from "react";
import Reveal from "./Reveal.jsx";
import { encode, complement, noteOf, gcPercent } from "../lib/dna.js";

const TRACK_COLORS = [
	"var(--base-a)",
	"var(--base-c)",
	"var(--base-g)",
	"var(--base-t)",
];
const BASE_COLOR = {
	A: "var(--base-a)",
	T: "var(--base-t)",
	C: "var(--base-c)",
	G: "var(--base-g)",
};

// Full-width DNA helix matching the audio wavelength view, placed underneath
function FullWidthDnaHelix({ title }) {
	const rawBases = encode(title);
	const gc = gcPercent(rawBases);
	const displayBases = Array.from(
		{ length: 44 },
		(_, i) => rawBases[i % rawBases.length],
	);
	const compBases = complement(displayBases);

	const step = 10; // 44 bases * 10 = 440 width, matching the svg viewBox
	const w = 440;
	const h = 28;
	const mid = h / 2;

	return (
		<div className="bl-helix-strip" title={`Sequence GC Content: ${gc}%`}>
			<svg
				viewBox={`0 0 ${w} ${h}`}
				preserveAspectRatio="none"
				className="bl-helix-svg"
				aria-hidden="true"
			>
				{displayBases.map((b, i) => {
					const x = i * step + 5;
					const phase = i * 0.42;
					const amp = 8;
					const y1 = mid + Math.sin(phase) * amp;
					const y2 = mid - Math.sin(phase) * amp;
					const depth = (Math.cos(phase) + 1) / 2;
					const cb = compBases[i];

					return (
						<g key={i}>
							<line
								x1={x}
								y1={y1}
								x2={x}
								y2={y2}
								stroke={BASE_COLOR[b]}
								strokeWidth="1.6"
								strokeOpacity={0.35 + depth * 0.45}
							/>
							<circle cx={x} cy={y1} r={2 + depth * 1} fill={BASE_COLOR[b]} />
							<circle
								cx={x}
								cy={y2}
								r={2 + (1 - depth) * 1}
								fill={BASE_COLOR[cb]}
							/>
						</g>
					);
				})}
			</svg>
			<span className="bl-gc-pill">GC {gc}%</span>
		</div>
	);
}

function DnaWaveform({ title, color, volume, muted }) {
	const waveBases = encode(title.padEnd(14, " "));
	const bars = Array.from({ length: 44 }, (_, i) => {
		const b = waveBases[i % waveBases.length];
		const { step } = noteOf(b, i);
		return Math.max(0.12, 0.22 + (step / 12) * 0.78);
	});

	const gain = muted ? 0.08 : Math.max(0.15, volume / 100);

	return (
		<div className="bl-waveform-strip" aria-hidden="true">
			<svg
				viewBox="0 0 440 36"
				preserveAspectRatio="none"
				className="bl-waveform-svg"
			>
				{bars.map((amp, i) => {
					const h = Math.max(3, amp * 30 * gain);
					const y = (36 - h) / 2;
					return (
						<rect
							key={i}
							style={{
								"--i": i,
							}} /* <-- This passes the index for the staggered animation */
							x={i * 10 + 2}
							y={y}
							width="5"
							height={h}
							rx="2.5"
							fill={color}
							opacity={muted ? 0.3 : 0.85}
						/>
					);
				})}
			</svg>
		</div>
	);
}

function ProjectTrack({ project, index, soloIndex, setSoloIndex }) {
	const [volume, setVolume] = useState(85);
	const [muted, setMuted] = useState(false);

	const color = TRACK_COLORS[index % TRACK_COLORS.length];
	const isSolo = soloIndex === index;
	const isDimmed = muted || (soloIndex !== null && !isSolo) || volume === 0;

	return (
		<Reveal
			as="article"
			className={`bl-track ${isDimmed ? "is-dimmed" : ""}`}
			style={{ "--track-color": color }}
		>
			{/* Left Track Header & Volume Controls */}
			<div className="bl-track-side">
				<div className="bl-track-meta">
					<span className="bl-track-num">
						{String(index + 1).padStart(2, "0")}
					</span>
					<span className="bl-track-when">{project.when}</span>
				</div>

				<h3 className="bl-track-name">{project.title}</h3>
				{project.kind && <span className="bl-track-kind">{project.kind}</span>}

				<div className="bl-ms-row">
					<button
						type="button"
						className={`bl-ms-btn mute ${muted ? "on" : ""}`}
						onClick={() => setMuted((m) => !m)}
						aria-pressed={muted}
						title="Mute track"
					>
						M
					</button>
					<button
						type="button"
						className={`bl-ms-btn solo ${isSolo ? "on" : ""}`}
						onClick={() => setSoloIndex(isSolo ? null : index)}
						aria-pressed={isSolo}
						title="Solo track"
					>
						S
					</button>
				</div>

				<label
					className="bl-vol-control"
					title={`Track volume: ${muted ? 0 : volume}%`}
				>
					<span className="bl-vol-icon" aria-hidden="true">
						{muted || volume === 0 ? "🔇" : volume < 50 ? "🔉" : "🔊"}
					</span>
					<input
						type="range"
						min="0"
						max="100"
						value={muted ? 0 : volume}
						onChange={(e) => {
							const v = Number(e.target.value);
							if (muted && v > 0) setMuted(false);
							setVolume(v);
						}}
						aria-label={`${project.title} volume`}
					/>
					<span className="bl-vol-val">{muted ? 0 : volume}%</span>
				</label>
			</div>

			{/* Right BandLab Audio Region with Waveform & Helix Stacked */}
			<div className="bl-region">
				<div className="bl-region-head">
					<span className="bl-region-title">{project.title}.wav</span>
					<span className="bl-region-stack">{project.stack}</span>
				</div>

				<DnaWaveform
					title={project.title}
					color={color}
					volume={volume}
					muted={muted}
				/>
				<FullWidthDnaHelix title={project.title} />

				<div className="bl-region-body">
					<ul>
						{project.bullets.map((b, i) => (
							<li key={i}>{b}</li>
						))}
					</ul>
					{project.link && (
						<a className="demo bl-demo-link" href={project.link.url}>
							{project.link.label} &rarr;
						</a>
					)}
				</div>
			</div>
		</Reveal>
	);
}

const Head = ({ children }) => <Reveal as="h2">{children}</Reveal>;

const Bullets = ({ items }) => (
	<ul>
		{items.map((b, i) => (
			<li key={i}>{b}</li>
		))}
	</ul>
);

export function About({ site }) {
	return (
		<section id="about" className="bl-section">
			<Head>About</Head>
			<div className="about bl-panel">
				<div>
					{site.about.map((p, i) => (
						<Reveal as="p" key={i} delay={i * 70}>
							{p}
						</Reveal>
					))}
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
	const [soloIndex, setSoloIndex] = useState(null);

	return (
		<section id="projects" className="bl-section">
			<div className="bl-section-head">
				<Head>Projects</Head>
				{soloIndex !== null && (
					<button
						type="button"
						className="bl-clear-solo"
						onClick={() => setSoloIndex(null)}
					>
						Clear Solo
					</button>
				)}
			</div>
			<div className="bl-tracks-list">
				{items.map((p, i) => (
					<ProjectTrack
						key={p.title}
						project={p}
						index={i}
						soloIndex={soloIndex}
						setSoloIndex={setSoloIndex}
					/>
				))}
			</div>
		</section>
	);
}

function Jobs({ items }) {
	return items.map((j) => (
		<Reveal as="article" className="job bl-panel-row" key={j.title + j.when}>
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
		<section id="experience" className="bl-section">
			<Head>Experience</Head>
			<div className="bl-panel">
				<Jobs items={site.experience} />
			</div>
			{site.volunteer?.length > 0 && (
				<>
					<p className="sub">Volunteer</p>
					<div id="volunteer-list" className="bl-panel">
						<Jobs items={site.volunteer} />
					</div>
				</>
			)}
		</section>
	);
}

export function Skills({ site }) {
	const bases = ["A", "T", "C", "G"];
	return (
		<section id="skills" className="bl-section">
			<Head>Skills and coursework</Head>
			<div className="bl-panel">
				<ul className="skills bl-skill-pads">
					{site.skills.map((s, i) => (
						<Reveal
							as="li"
							key={s}
							delay={(i % 4) * 50}
							style={{ "--pad-color": TRACK_COLORS[i % 4] }}
						>
							<span className="bl-base-tag">{bases[i % 4]}</span>
							{s}
						</Reveal>
					))}
				</ul>
				<ul className="courses">
					{site.courses.map((c, i) => (
						<Reveal as="li" key={c} delay={(i % 4) * 50}>
							{c}
						</Reveal>
					))}
				</ul>
			</div>
		</section>
	);
}

export function Contact({ site }) {
	return (
		<section id="contact" className="contact bl-section">
			<Head>Contact</Head>
			<div className="bl-panel">
				<Reveal as="p">
					Looking for a collaborator, or want to talk about a project? Send me a
					note.
				</Reveal>
				<Reveal as="p" className="big">
					<a href={`mailto:${site.email}`}>{site.email}</a>
				</Reveal>
				<Reveal as="p">
					<a href={site.github}>{site.githubLabel}</a>
				</Reveal>
			</div>
		</section>
	);
}

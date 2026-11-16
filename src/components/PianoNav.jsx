import { useEffect, useRef, useState } from "react";

const KEYS = [
	{ id: "about", label: "About", freq: 261.63 },
	{ id: "projects", label: "Projects", freq: 293.66 },
	{ id: "experience", label: "Experience", freq: 329.63 },
	{ id: "skills", label: "Skills", freq: 349.23 },
	{ id: "contact", label: "Contact", freq: 392.0 },
];
const BLACK_KEYS = [20, 40, 80]; // % from left

export default function PianoNav({ sound }) {
	const [active, setActive] = useState(-1);
	const [pressed, setPressed] = useState(-1);
	const audio = useRef(null);

	useEffect(() => {
		const onScroll = () => {
			const y = window.scrollY + 160;
			let cur = -1;
			KEYS.forEach((k, i) => {
				const el = document.getElementById(k.id);
				if (el && el.offsetTop <= y) cur = i;
			});
			setActive(cur);
		};
		onScroll();
		window.addEventListener("scroll", onScroll, { passive: true });
		return () => window.removeEventListener("scroll", onScroll);
	}, []);

	const play = (f) => {
		if (!sound) return;
		try {
			audio.current =
				audio.current ||
				new (window.AudioContext || window.webkitAudioContext)();
			const ac = audio.current,
				o = ac.createOscillator(),
				g = ac.createGain(),
				now = ac.currentTime;
			o.type = "triangle";
			o.frequency.value = f;
			g.gain.setValueAtTime(0.0001, now);
			g.gain.exponentialRampToValueAtTime(0.18, now + 0.02);
			g.gain.exponentialRampToValueAtTime(0.0001, now + 0.6);
			o.connect(g);
			g.connect(ac.destination);
			o.start(now);
			o.stop(now + 0.65);
		} catch {
			/* audio unavailable */
		}
	};

	const onKey = (i) => {
		play(KEYS[i].freq);
		setPressed(i);
		setTimeout(() => setPressed(-1), 180);
	};

	return (
		<nav className="keys" aria-label="Sections">
			<div className="inner">
				{KEYS.map((k, i) => (
					<a
						key={k.id}
						href={`#${k.id}`}
						onClick={() => onKey(i)}
						className={`${active === i ? "on" : ""} ${pressed === i ? "pressed" : ""}`.trim()}
					>
						{k.label}
					</a>
				))}
				{BLACK_KEYS.map((left) => (
					<span
						key={left}
						className="black"
						style={{ left: `${left}%` }}
						aria-hidden="true"
					/>
				))}
			</div>
		</nav>
	);
}

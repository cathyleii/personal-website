import { useEffect, useRef, useState } from "react";

const NAV_ITEMS = [
	{ id: "about", label: "About", freq: 261.63 },
	{ id: "projects", label: "Projects", freq: 293.66 },
	{ id: "experience", label: "Experience", freq: 329.63 },
	{ id: "skills", label: "Skills", freq: 349.23 },
	{ id: "contact", label: "Contact", freq: 392.0 },
];

export default function DawTransport({ sound, setSound }) {
	const [active, setActive] = useState(0);
	const audio = useRef(null);

	useEffect(() => {
		const onScroll = () => {
			const y = window.scrollY + 160;
			let cur = 0;
			NAV_ITEMS.forEach((item, i) => {
				const el = document.getElementById(item.id);
				if (el && el.offsetTop <= y) cur = i;
			});
			setActive(cur);
		};
		onScroll();
		window.addEventListener("scroll", onScroll, { passive: true });
		return () => window.removeEventListener("scroll", onScroll);
	}, []);

	const ping = (freq) => {
		if (!sound) return;
		try {
			audio.current =
				audio.current ||
				new (window.AudioContext || window.webkitAudioContext)();
			const ac = audio.current;
			const o = ac.createOscillator();
			const g = ac.createGain();
			const now = ac.currentTime;
			o.type = "triangle";
			o.frequency.value = freq;
			g.gain.setValueAtTime(0.0001, now);
			g.gain.exponentialRampToValueAtTime(0.14, now + 0.015);
			g.gain.exponentialRampToValueAtTime(0.0001, now + 0.4);
			o.connect(g);
			g.connect(ac.destination);
			o.start(now);
			o.stop(now + 0.45);
		} catch {
			/* audio unavailable */
		}
	};

	return (
		<header className="bl-topbar" aria-label="Studio navigation">
			<div className="bl-topbar-inner">
				<div className="bl-session">
					<span className="bl-dot" aria-hidden="true" />
					<span className="bl-title">cathy_lei.mix</span>
					<span className="bl-tag">120 BPM</span>
				</div>

				<nav className="bl-nav" aria-label="Sections">
					{NAV_ITEMS.map((item, i) => (
						<a
							key={item.id}
							href={`#${item.id}`}
							onClick={() => ping(item.freq)}
							className={`bl-nav-link ${active === i ? "is-active" : ""}`}
						>
							{item.label}
						</a>
					))}
				</nav>

				<button
					type="button"
					className={`bl-sound-btn ${sound ? "is-on" : ""}`}
					aria-pressed={sound}
					onClick={() => setSound((s) => !s)}
				>
					&#9835; Sound: {sound ? "On" : "Off"}
				</button>
			</div>
			<div className="bl-scrubber" aria-hidden="true">
				<div className="bl-scrubber-fill" />
			</div>
		</header>
	);
}

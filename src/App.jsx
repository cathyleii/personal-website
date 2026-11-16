import { useEffect, useState } from "react";
import SITE from "./data/content.js";
import Hero from "./components/Hero.jsx";
import DawTransport from "./components/DawTransport.jsx";
import {
	About,
	Projects,
	Experience,
	Skills,
	Contact,
} from "./components/Sections.jsx";

export default function App() {
	const [sound, setSound] = useState(true);
	useEffect(() => {
		const on = () => {
			const max = document.documentElement.scrollHeight - window.innerHeight;
			document.documentElement.style.setProperty(
				"--p",
				max > 0 ? window.scrollY / max : 0,
			);
		};
		on();
		window.addEventListener("scroll", on, { passive: true });
		return () => window.removeEventListener("scroll", on);
	}, []);
	return (
		<>
			<DawTransport sound={sound} setSound={setSound} />
			<Hero site={SITE} sound={sound} setSound={setSound} />
			<main className="wrap">
				<About site={SITE} />
				<Projects items={SITE.projects} />
				<Experience site={SITE} />
				<Skills site={SITE} />
				<Contact site={SITE} />
			</main>
			<footer>
				<div className="wrap">
					&copy; {new Date().getFullYear()} {SITE.name}
				</div>
			</footer>
		</>
	);
}

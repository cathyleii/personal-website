import { encode, noteOf } from "../lib/dna.js";
import { tone } from "../lib/audio.js";

const COLOR = {
	A: "var(--base-a)",
	T: "var(--base-t)",
	C: "var(--base-c)",
	G: "var(--base-g)",
};

// A project's "genome": its title as colored bars. Click to hear it.
export default function SeqStrip({ text }) {
	const bases = encode(text.slice(0, 10));
	const play = () =>
		bases.forEach((b, i) =>
			setTimeout(() => tone(noteOf(b, i).freq, 0.3, 0.12), i * 110),
		);
	return (
		<button
			type="button"
			className="strip"
			onClick={play}
			aria-label={`Play the DNA melody of ${text}`}
		>
			{bases.map((b, i) => (
				<span
					key={i}
					style={{
						background: COLOR[b],
						height: `${8 + noteOf(b, i).step * 2.2}px`,
					}}
				/>
			))}
			<em>&#9654; hear its sequence</em>
		</button>
	);
}

import { useEffect, useRef } from "react";
import { noteOf, complement, gcPercent, translate } from "../lib/dna.js";
import { tone } from "../lib/audio.js";

const COLOR = {
	A: "var(--base-a)",
	T: "var(--base-t)",
	C: "var(--base-c)",
	G: "var(--base-g)",
};
const X0 = 34,
	DX = 22,
	Y0 = 96,
	DY = 6;

// A name, translated to DNA, written on a staff, and played as a two-voice duet
// (the complementary strand is the lower voice).
export default function Sequencer({ text, setText, bases, pos, setPos }) {
	const timer = useRef(0);
	useEffect(() => () => clearTimeout(timer.current), []);
	const comp = complement(bases);

	const play = () => {
		clearTimeout(timer.current);
		let i = 0;
		const next = () => {
			if (i >= bases.length) {
				setPos(-1);
				return;
			}
			setPos(i);
			tone(noteOf(bases[i], i).freq);
			tone(noteOf(comp[i], i).freq / 2, 0.5, 0.09);
			i++;
			timer.current = setTimeout(next, 170);
		};
		next();
	};

	const id = text.trim().toLowerCase().replace(/\s+/g, "_") || "seq";
	const W = X0 * 2 + bases.length * DX;
	return (
		<div className="seqbox">
			<div className="seqhead">
				<label>
					<span className="mvt">Sequence a name</span>
					<input
						value={text}
						maxLength={12}
						onChange={(e) => {
							clearTimeout(timer.current);
							setPos(-1);
							setText(e.target.value);
						}}
					/>
				</label>
				<button type="button" className="btn primary" onClick={play}>
					&#9654; Play duet
				</button>
			</div>

			<div className="seqscroll">
				<svg
					width={W}
					height="146"
					viewBox={`0 0 ${W} 146`}
					role="img"
					aria-label={`${text} written as ${bases.length} DNA bases on a musical staff`}
				>
					<text x="4" y="118" className="seqchar">
						5′
					</text>
					<text x="4" y="138" className="seqchar">
						3′
					</text>
					{[2, 4, 6, 8, 10].map((s) => (
						<line
							key={s}
							x1="8"
							x2={W - 8}
							y1={Y0 - s * DY}
							y2={Y0 - s * DY}
							stroke="var(--ink)"
							strokeOpacity=".45"
						/>
					))}
					{bases.map((b, i) => {
						const { step } = noteOf(b, i),
							x = X0 + i * DX,
							y = Y0 - step * DY,
							on = i === pos;
						return (
							<g key={i}>
								{i % 4 === 0 && (
									<text x={x - 8} y="16" className="seqchar">
										{text[i / 4] === " " ? "\u00B7" : text[i / 4]}
									</text>
								)}
								{i % 4 === 3 && (
									<line
										x1={x + DX / 2}
										x2={x + DX / 2}
										y1={Y0 - 60}
										y2={Y0 - 12}
										stroke="var(--line)"
									/>
								)}
								{(step === 0 || step === 12) && (
									<line
										x1={x - 10}
										x2={x + 10}
										y1={y}
										y2={y}
										stroke="var(--ink)"
										strokeOpacity=".45"
									/>
								)}
								<circle
									cx={x}
									cy={y}
									r={on ? 9 : 6.5}
									fill={COLOR[b]}
									className="seqnote"
								/>
								<text
									x={x}
									y="118"
									textAnchor="middle"
									className="seqbase"
									fill={COLOR[b]}
								>
									{b}
								</text>
								<text
									x={x}
									y="138"
									textAnchor="middle"
									className="seqbase seqcomp"
									fill={COLOR[comp[i]]}
								>
									{comp[i]}
								</text>
							</g>
						);
					})}
				</svg>
			</div>

			<pre className="fasta" aria-label="FASTA record">
				<span className="hdr">{`>${id}  len=${bases.length}  GC=${gcPercent(bases)}%`}</span>
				{"\n"}
				{bases.map((b, i) => (
					<span key={i} style={{ color: COLOR[b] }}>
						{b}
					</span>
				))}
				{"\n"}
				<span className="hdr">{"peptide  "}</span>
				{translate(bases).split("").join(" ").replace(/\*/g, "\u25A0")}
			</pre>
			<p className="seqnote-cap">
				Each letter is 4 bases (A, C, G, T become the notes C, E, G, A). The
				complementary strand (A-T, C-G) is the lower voice, and every 3 bases is
				a codon you can read as an amino acid.
			</p>
		</div>
	);
}

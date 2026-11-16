// Text -> DNA -> melody. Each character becomes 4 bases (2 bits each).
const BASES = 'ACGT';
const SEMI = { A: 0, C: 4, G: 7, T: 9 };   // C  E  G  A  (a C6 chord)
const STEP = { A: 0, C: 2, G: 4, T: 5 };   // same notes as staff positions (C4 = 0)

export const encode = (text) =>
  [...text].flatMap(ch => {
    const c = ch.charCodeAt(0) & 255;
    return [(c >> 6) & 3, (c >> 4) & 3, (c >> 2) & 3, c & 3].map(v => BASES[v]);
  });

// Every third base jumps an octave, like a codon accent.
export const noteOf = (base, i) => {
  const up = i % 3 === 2;
  return { step: STEP[base] + (up ? 7 : 0), freq: 261.63 * 2 ** ((SEMI[base] + (up ? 12 : 0)) / 12) };
};

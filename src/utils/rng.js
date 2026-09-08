// Seeded RNG: the ONLY source of randomness in the app.
// ORDER CONTRACT: the sequence of rng draws inside generateFace() defines a seed's face. Never insert/remove a draw or consume rng outside generateFace(); doing so changes every previously shared seed's output.
import seedrandom from "seedrandom";

let rng = seedrandom(); // autoseeded from crypto, only used to mint new seed strings

export function setSeed(seed) {
  // the "\0" terminator avoids seedrandom's short-key equivalence (e.g. "ab" == "abab")
  rng = seedrandom(String(seed) + "\0");
}

export function next() {
  return rng();
}

export function randomFromInterval(min, max) {
  // min and max included
  return next() * (max - min) + min;
}

export function chance(p) {
  return next() < p;
}

export function pick(arr) {
  return arr[Math.floor(next() * arr.length)];
}

export function randomSeedString() {
  return seedrandom()().toString(36).slice(2, 10);
}

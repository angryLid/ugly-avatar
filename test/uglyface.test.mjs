import test from "node:test";
import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { createRequire } from "node:module";
import { ref, nextTick } from "vue";
import {
  generateFaceData,
  faceDataToSVG,
  generateFaceSVG,
  generateFaceDataURL,
  generateFacePNG,
  svgToDataURL,
  randomSeed,
} from "../src/lib/index.js";
import { useUglyFace } from "../src/lib/vue.js";

const require = createRequire(import.meta.url);

test("same seed renders byte-identical svg", () => {
  assert.equal(generateFaceSVG("reproducible"), generateFaceSVG("reproducible"));
});

test("different seeds render different faces", () => {
  assert.notEqual(generateFaceSVG("alice"), generateFaceSVG("bob"));
});

test("svg carries the expected structure", () => {
  const svg = generateFaceSVG("structure");
  assert.ok(svg.startsWith("<svg"));
  assert.ok(svg.endsWith("</svg>"));
  assert.ok(svg.includes('viewBox="-100 -100 200 200"'));
  assert.ok(svg.includes('id="fuzzy"'));
  assert.ok(svg.includes('id="faceContour"'));
  assert.ok(svg.includes('id="hairs"'));
  assert.ok(svg.includes('id="mouth"'));
  assert.ok(svg.includes("ANGRYLID.GITHUB.IO"));
});

test("transparent option drops the background rect", () => {
  const withBg = generateFaceSVG("bg", { transparent: false });
  const withoutBg = generateFaceSVG("bg", { transparent: true });
  assert.ok(withBg.includes("<rect"));
  assert.ok(!withoutBg.includes("<rect"));
});

test("size option controls width/height", () => {
  const svg = generateFaceSVG("size", { size: 128 });
  assert.ok(svg.includes('width="128"'));
  assert.ok(svg.includes('height="128"'));
});

test("face data is reusable via faceDataToSVG", () => {
  const face = generateFaceData("reuse");
  assert.equal(face.seed, "reuse");
  assert.equal(faceDataToSVG(face), generateFaceSVG("reuse"));
});

test("data url round-trips the svg", () => {
  const url = generateFaceDataURL("b64");
  assert.match(url, /^data:image\/svg\+xml;base64,/);
  const decoded = Buffer.from(url.slice(url.indexOf(",") + 1), "base64").toString("utf-8");
  assert.equal(decoded, generateFaceSVG("b64"));
});

test("svgToDataURL handles unicode payloads", () => {
  const svgString = "<svg><title>丑</title></svg>";
  const url = svgToDataURL(svgString);
  const decoded = Buffer.from(url.slice(url.indexOf(",") + 1), "base64").toString("utf-8");
  assert.equal(decoded, svgString);
});

test("randomSeed mints fresh 8-char base36 seeds", () => {
  const s = randomSeed();
  assert.match(s, /^[0-9a-z]{8}$/);
  assert.notEqual(s, randomSeed());
});

test("generateFacePNG reports browser-only usage in node", async () => {
  await assert.rejects(() => generateFacePNG("png"), /browser canvas/);
});

test("cjs build loads and generates", { skip: !existsSync("lib/index.cjs") }, () => {
  const ugly = require("../lib/index.cjs");
  assert.ok(ugly.generateFaceSVG("cjs").startsWith("<svg"));
});

test("useUglyFace reproduces a seed and derives svg/dataUrl", () => {
  const h = useUglyFace("demo");
  assert.equal(h.seed.value, "demo");
  assert.equal(h.svg.value, generateFaceSVG("demo"));
  assert.ok(h.dataUrl.value.startsWith("data:image/svg+xml;base64,"));
});

test("useUglyFace setSeed and regenerate work", () => {
  const h = useUglyFace();
  h.setSeed("fixed");
  assert.equal(h.seed.value, "fixed");
  assert.equal(h.svg.value, generateFaceSVG("fixed"));
  h.regenerate();
  assert.notEqual(h.seed.value, "fixed");
});

test("useUglyFace watches a reactive seed source", async () => {
  const seed = ref("one");
  const h = useUglyFace(seed);
  assert.equal(h.svg.value, generateFaceSVG("one"));
  seed.value = "two";
  await nextTick(); // watch flush is queued on the microtask scheduler, not synchronous
  assert.equal(h.svg.value, generateFaceSVG("two"));
});

// uglymug public API. Core is framework-free; the Vue composable lives in ./vue.js.
import { generateFaceData, HAIR_COLORS, BACKGROUND_COLORS } from "./face-data.js";
import { faceDataToSVG } from "./svg.js";
import { randomSeedString } from "../utils/rng.js";

export { generateFaceData, HAIR_COLORS, BACKGROUND_COLORS, faceDataToSVG };
export const randomSeed = randomSeedString;

export function generateFaceSVG(seed, opts) {
  return faceDataToSVG(generateFaceData(seed), opts);
}

function toBase64(str) {
  if (typeof Buffer !== "undefined") {
    return Buffer.from(str, "utf-8").toString("base64");
  }
  return btoa(unescape(encodeURIComponent(str)));
}

export function svgToDataURL(svgString) {
  return "data:image/svg+xml;base64," + toBase64(svgString);
}

export function generateFaceDataURL(seed, opts) {
  return svgToDataURL(generateFaceSVG(seed, opts));
}

// Browser-only rasterization. In Node, rasterize the SVG string with @resvg/resvg-js instead (see README).
export function generateFacePNG(seed, opts) {
  if (typeof document === "undefined" || typeof window === "undefined") {
    return Promise.reject(
      new Error(
        "generateFacePNG() needs a browser canvas. In Node, rasterize the SVG string with @resvg/resvg-js — see the README.",
      ),
    );
  }
  const size = (opts && opts.size) || 500;
  return new Promise((resolve, reject) => {
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d");
    const img = new Image();
    img.onload = function () {
      ctx.drawImage(img, 0, 0, size, size);
      resolve(canvas.toDataURL("image/png"));
    };
    img.onerror = reject;
    img.src = generateFaceDataURL(seed, opts);
  });
}

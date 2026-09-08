// Vue 3 composable over the core generator. Subpath export: "uglymug/vue".
// The component/template must never draw rng itself — all randomness happens once inside
// generateFaceData() — so re-renders never re-roll the face.
import { computed, ref, unref, watch, isRef } from "vue";
import { generateFaceData, faceDataToSVG, svgToDataURL } from "./index.js";

export function useUglyMug(seed) {
  const readSeed = () => (seed == null ? undefined : unref(seed));
  const face = ref(generateFaceData(readSeed()));
  if (seed != null && (isRef(seed) || typeof seed === "function")) {
    watch(readSeed, (s) => {
      face.value = generateFaceData(s || undefined);
    });
  }
  const svg = computed(() => faceDataToSVG(face.value));
  const dataUrl = computed(() => svgToDataURL(svg.value));
  function regenerate() {
    face.value = generateFaceData();
  }
  function setSeed(s) {
    face.value = generateFaceData(s || undefined);
  }
  return { seed: computed(() => face.value.seed), face, svg, dataUrl, regenerate, setSeed };
}

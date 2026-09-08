<template>
  <div class="container">
    <div class="face" v-html="svg"></div>
    <button @click="regenerate()">ANOTHER</button>
    <button @click="downloadSVGAsPNG">DOWNLOAD</button>
    <div class="seed-row">
      <span class="seed-label" :title="seed">{{ seed || "-" }}</span>
      <input
        v-model="seedInput"
        class="seed-input"
        placeholder="type a seed"
        @keyup.enter="loadSeed"
      />
      <button class="small" @click="loadSeed">LOAD SEED</button>
      <button class="small" @click="copyLink">
        {{ copied ? "COPIED ✓" : "COPY LINK" }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, onUnmounted } from "vue";
import { useUglyFace } from "../lib/vue.js";
import { svgToDataURL } from "../lib/index.js";

const params = new URLSearchParams(window.location.search);
const { seed, svg, regenerate, setSeed } = useUglyFace(
  params.get("seed") || undefined,
);

const seedInput = ref("");
const copied = ref(false);

// Keep the URL in sync for every path (first load, ANOTHER, space key, LOAD SEED)
// so a page reload or COPY LINK always reproduces the current face.
watch(
  seed,
  (s) => {
    try {
      history.replaceState(null, "", "?seed=" + encodeURIComponent(s));
    } catch (e) {
      // history API unavailable (e.g. sandboxed iframe); sharing falls back to copying the seed text
    }
  },
  { immediate: true },
);

function loadSeed() {
  const s = seedInput.value.trim();
  if (s) setSeed(s);
}

function copyLink() {
  navigator.clipboard.writeText(window.location.href).then(() => {
    copied.value = true;
    setTimeout(() => {
      copied.value = false;
    }, 1500);
  });
}

function downloadSVGAsPNG() {
  const canvas = document.createElement("canvas");
  canvas.width = 500;
  canvas.height = 500;
  const ctx = canvas.getContext("2d");
  const img = document.createElement("img");
  img.src = svgToDataURL(svg.value);
  img.onload = function () {
    ctx.drawImage(img, 0, 0);
    const a = document.createElement("a");
    const e = new MouseEvent("click");
    a.download = "face.png";
    a.href = canvas.toDataURL("image/png");
    a.dispatchEvent(e);
  };
}

function onKeyDown(e) {
  if (e.target.tagName === "INPUT") return;
  if (e.key === " ") {
    regenerate();
  } else if (e.key === "s") {
    downloadSVGAsPNG();
  }
}

onMounted(() => {
  window.addEventListener("keydown", onKeyDown);
});

onUnmounted(() => {
  window.removeEventListener("keydown", onKeyDown);
});
</script>

<style scoped>
.container {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: inline-flex;
  /* align-items items in column */
  flex-direction: column;
  /* center items horizontally */
  align-items: center;
  /* center items vertically */
  justify-content: center;
  background-color: #ffffff;
  padding: 5px;
}
.face :deep(svg) {
  display: block;
}
.seed-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 10px;
}
.seed-label {
  max-width: 160px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-family: monospace;
  font-size: 13px;
}
.seed-input {
  width: 130px;
  padding: 4px 6px;
  border: 2px solid black;
  border-radius: 8px;
  font-size: 13px;
}
button.small {
  width: auto;
  margin-top: 0;
  padding: 4px 10px;
  font-size: 12px;
}
button {
  margin-top: 10px;
  width: 200px;
  padding: 5px;
  background: transparent;
  border-width: 2px;
  font-size: 15px;
  border-color: black;
  color: black;
  font-weight: bold;
  user-select: none;
  border-radius: 10px;
  box-shadow: 2px 2px 0px 0px rgba(0, 0, 0, 0.75);
}

button:hover {
  background: black;
  color: white;
  transition: 0.3s;
}
button:active {
  background: rgb(65, 65, 65);
  box-shadow: 1px 1px 0px 0px rgba(0, 0, 0, 0.75);
}
</style>

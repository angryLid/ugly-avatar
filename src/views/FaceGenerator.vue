<template>
  <div class="container">
    <svg
      viewBox="-100 -100 200 200"
      xmlns="http://www.w3.org/2000/svg"
      width="500"
      height="500"
      id="face-svg"
    >
      <defs>
        <clipPath id="leftEyeClipPath">
          <polyline :points="eyeLeftCountour" />
        </clipPath>
        <clipPath id="rightEyeClipPath">
          <polyline :points="eyeRightCountour" />
        </clipPath>

        <filter id="fuzzy">
          <feTurbulence
            id="turbulence"
            baseFrequency="0.05"
            numOctaves="3"
            type="noise"
            result="noise"
          />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="2" />
        </filter>
        <linearGradient id="rainbowGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop
            offset="0%"
            :style="
              'stop-color: ' +
              dyeColors[0] +
              ';  stop-opacity: 1'
            "
          />
          <stop
            :offset="dyeColorOffset"
            :style="
              'stop-color: ' +
              dyeColors[1] +
              ';  stop-opacity: 1'
            "
          />
          <stop
            offset="100%"
            :style="
              'stop-color: ' +
              dyeColors[2] +
              ';  stop-opacity: 1'
            "
          />
        </linearGradient>
      </defs>
      <title>That's an ugly face</title>
      <desc>CREATED BY XUAN TANG, MORE INFO AT TXSTC55.GITHUB.IO</desc>
      <rect
        x="-100"
        y="-100"
        width="100%"
        height="100%"
        :fill="backgroundColor"
      />
      <polyline
        id="faceContour"
        :points="computedFacePoints"
        fill="#ffc9a9"
        stroke="black"
        :stroke-width="3.0 / faceScale"
        stroke-linejoin="round"
        filter="url(#fuzzy)"
      />

      <g
        :transform="
          'translate(' +
          (center[0] + distanceBetweenEyes + rightEyeOffsetX) +
          ' ' +
          -(-center[1] + eyeHeightOffset + rightEyeOffsetY) +
          ')'
        "
      >
        <polyline
          id="rightCountour"
          :points="eyeRightCountour"
          fill="white"
          stroke="white"
          :stroke-width="0.0 / faceScale"
          stroke-linejoin="round"
          filter="url(#fuzzy)"
        />
      </g>
      <g
        :transform="
          'translate(' +
          -(center[0] + distanceBetweenEyes + leftEyeOffsetX) +
          ' ' +
          -(-center[1] + eyeHeightOffset + leftEyeOffsetY) +
          ')'
        "
      >
        <polyline
          id="leftCountour"
          :points="eyeLeftCountour"
          fill="white"
          stroke="white"
          :stroke-width="0.0 / faceScale"
          stroke-linejoin="round"
          filter="url(#fuzzy)"
        />
      </g>
      <g
        :transform="
          'translate(' +
          (center[0] + distanceBetweenEyes + rightEyeOffsetX) +
          ' ' +
          -(-center[1] + eyeHeightOffset + rightEyeOffsetY) +
          ')'
        "
      >
        <polyline
          id="rightUpper"
          :points="eyeRightUpper"
          fill="none"
          stroke="black"
          :stroke-width="(this.haventSleptForDays ? 5.0 : 3.0) / faceScale"
          stroke-linejoin="round"
          stroke-linecap="round"
          filter="url(#fuzzy)"
        />
        <polyline
          id="rightLower"
          :points="eyeRightLower"
          fill="none"
          stroke="black"
          :stroke-width="(this.haventSleptForDays ? 5.0 : 3.0) / faceScale"
          stroke-linejoin="round"
          stroke-linecap="round"
          filter="url(#fuzzy)"
        />
        <circle
          v-for="(c, i) in pupilCirclesRight"
          :key="i"
          :r="c.r"
          :cx="rightPupilShiftX + c.dx"
          :cy="rightPupilShiftY + c.dy"
          stroke="black"
          fill="none"
          :stroke-width="c.w"
          filter="url(#fuzzy)"
          clip-path="url(#rightEyeClipPath)"
        />
      </g>
      <g
        :transform="
          'translate(' +
          -(center[0] + distanceBetweenEyes + leftEyeOffsetX) +
          ' ' +
          -(-center[1] + eyeHeightOffset + leftEyeOffsetY) +
          ')'
        "
      >
        <polyline
          id="leftUpper"
          :points="eyeLeftUpper"
          fill="none"
          stroke="black"
          :stroke-width="(this.haventSleptForDays ? 5.0 : 3.0) / faceScale"
          stroke-linejoin="round"
          filter="url(#fuzzy)"
        />
        <polyline
          id="leftLower"
          :points="eyeLeftLower"
          fill="none"
          stroke="black"
          :stroke-width="(this.haventSleptForDays ? 5.0 : 3.0) / faceScale"
          stroke-linejoin="round"
          filter="url(#fuzzy)"
        />
        <circle
          v-for="(c, i) in pupilCirclesLeft"
          :key="i"
          :r="c.r"
          :cx="leftPupilShiftX + c.dx"
          :cy="leftPupilShiftY + c.dy"
          stroke="black"
          fill="none"
          :stroke-width="c.w"
          filter="url(#fuzzy)"
          clip-path="url(#leftEyeClipPath)"
        />
      </g>
      <g id="hairs">
        <polyline
          v-for="(hair, index) in hairs"
          :key="index"
          :points="hair"
          fill="none"
          :stroke="hairColor"
          :stroke-width="hairWidths[index]"
          stroke-linejoin="round"
          filter="url(#fuzzy)"
        />
      </g>
      <g id="pointNose" v-if="usePointNose">
        <g id="rightNose">
          <circle
            v-for="(c, i) in noseCirclesRight"
            :key="i"
            :r="c.r"
            :cx="rightNoseCenterX + c.dx"
            :cy="rightNoseCenterY + c.dy"
            stroke="black"
            fill="none"
            :stroke-width="c.w"
            filter="url(#fuzzy)"
          />
        </g>
        <g id="leftNose">
          <circle
            v-for="(c, i) in noseCirclesLeft"
            :key="i"
            :r="c.r"
            :cx="leftNoseCenterX + c.dx"
            :cy="leftNoseCenterY + c.dy"
            stroke="black"
            fill="none"
            :stroke-width="c.w"
            filter="url(#fuzzy)"
          />
        </g>
      </g>
      <g id="lineNose" v-else>
        <path
          :d="
            'M ' +
            leftNoseCenterX +
            ' ' +
            leftNoseCenterY +
            ', Q' +
            rightNoseCenterX +
            ' ' +
            rightNoseCenterY * 1.5 +
            ',' +
            (leftNoseCenterX + rightNoseCenterX) / 2 +
            ' ' +
            -eyeHeightOffset * 0.2
          "
          fill="none"
          stroke="black"
          :stroke-width="lineNoseWidth"
          stroke-linejoin="round"
          filter="url(#fuzzy)"
        ></path>
      </g>
      <g id="mouth">
        <polyline
          :points="mouthPoints"
          fill="rgb(215,127,140)"
          stroke="black"
          :stroke-width="mouthWidth"
          stroke-linejoin="round"
          filter="url(#fuzzy)"
        />
      </g>
    </svg>
    <button @click="generateFace()">ANOTHER</button>
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
    <div v-if="selfCheckResult" class="selfcheck" :class="selfCheckResult">
      {{ selfCheckResult === "pass" ? "REPRODUCIBLE ✓" : "MISMATCH ✗" }}
    </div>
  </div>
</template>

<script>
import { generateFaceData } from "../lib/face-data.js";

export default {
  name: "FaceGenerator",
  data() {
    return {
      faceScale: 1.8, // face scale
      computedFacePoints: [], // the polygon points for face countour
      eyeRightUpper: [], // the points for right eye upper lid
      eyeRightLower: [],
      eyeRightCountour: [], // for the white part of the eye
      eyeLeftUpper: [],
      eyeLeftLower: [],
      eyeLeftCountour: [],
      faceHeight: 0, // the height of the face
      faceWidth: 0, // the width of the face
      center: [0, 0], // the center of the face
      distanceBetweenEyes: 0, // the distance between the eyes
      leftEyeOffsetX: 0, // the offset of the left eye
      leftEyeOffsetY: 0, // the offset of the left eye
      rightEyeOffsetX: 0, // the offset of the right eye
      rightEyeOffsetY: 0, // the offset of the right eye
      eyeHeightOffset: 0, // the offset of the eye height
      leftEyeCenter: [0, 0], // the center of the left eye
      rightEyeCenter: [0, 0], // the center of the right eye
      rightPupilShiftX: 0, // the shift of the right pupil
      rightPupilShiftY: 0, // the shift of the right pupil
      leftPupilShiftX: 0, // the shift of the left pupil
      leftPupilShiftY: 0, // the shift of the left pupil
      rightNoseCenterX: 0, // the center of the right nose
      rightNoseCenterY: 0, // the center of the right nose
      leftNoseCenterX: 0, // the center of the left nose
      leftNoseCenterY: 0, // the center of the left nose
      hairs: [],
      haventSleptForDays: false,
      hairColor: "black",
      dyeColorOffset: "50%",
      mouthPoints: [],
      seed: "",
      seedInput: "",
      copied: false,
      selfCheckResult: "",
      backgroundColor: "white",
      dyeColors: ["black", "black", "black"],
      pupilCirclesRight: [],
      pupilCirclesLeft: [],
      hairWidths: [],
      usePointNose: true,
      noseCirclesRight: [],
      noseCirclesLeft: [],
      lineNoseWidth: 3,
      mouthWidth: 3,
    };
  },
  methods: {
    generateFace(seed) {
      Object.assign(this, generateFaceData(seed));
      try {
        history.replaceState(null, "", "?seed=" + encodeURIComponent(this.seed));
      } catch (e) {
        // history API unavailable (e.g. sandboxed iframe); sharing falls back to copying the seed text
      }
    },
    loadSeed() {
      const s = this.seedInput.trim();
      if (s) this.generateFace(s);
    },
    copyLink() {
      navigator.clipboard.writeText(window.location.href).then(() => {
        this.copied = true;
        setTimeout(() => {
          this.copied = false;
        }, 1500);
      });
    },
    runSelfCheck() {
      const svg = document.getElementById("face-svg");
      const first = new XMLSerializer().serializeToString(svg);
      this.generateFace(this.seed);
      this.$nextTick(() => {
        const second = new XMLSerializer().serializeToString(svg);
        this.selfCheckResult = first === second ? "pass" : "fail";
      });
    },
    downloadSVGAsPNG() {
      // download our svg as png
      const svg = document.getElementById("face-svg");
      const svgData = new XMLSerializer().serializeToString(svg);
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      const img = document.createElement("img");
      const svgSize = svg.getBoundingClientRect();
      canvas.width = svgSize.width;
      canvas.height = svgSize.height;
      img.setAttribute("src", "data:image/svg+xml;base64," + btoa(svgData));
      img.onload = function () {
        ctx.drawImage(img, 0, 0);
        const a = document.createElement("a");
        const e = new MouseEvent("click");
        a.download = "face.png";
        a.href = canvas.toDataURL("image/png");
        a.dispatchEvent(e);
      };
    },
  },
  mounted() {
    const params = new URLSearchParams(window.location.search);
    this.generateFace(params.get("seed") || undefined);
    if (params.get("selfcheck") === "1") {
      this.$nextTick(() => this.runSelfCheck());
    }
    // add key binding
    window.addEventListener("keydown", (e) => {
      if (e.target.tagName === "INPUT") return;
      if (e.key === " ") {
        this.generateFace();
        // this.downloadSVGAsPNG();
      } else if (e.key === "s") {
        this.downloadSVGAsPNG();
      }
    });
  },
};
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
.selfcheck {
  position: fixed;
  top: 10px;
  left: 50%;
  transform: translateX(-50%);
  padding: 6px 14px;
  border-radius: 8px;
  font-weight: bold;
  z-index: 10;
}
.selfcheck.pass {
  background: #d4f7d4;
  color: #0a5c0a;
}
.selfcheck.fail {
  background: #ffd6d6;
  color: #8a0a0a;
}
svg {
  background-color: #ffffff;
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

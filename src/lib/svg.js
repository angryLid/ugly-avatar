// Turns face data (see face-data.js) into a standalone SVG string. This is a 1:1 port of
// the FaceGenerator.vue template: same ids, same attributes, same computed expressions, so
// the npm package and the web demo render identical faces for a seed.
export function faceDataToSVG(face, opts = {}) {
  const size = opts.size == null ? 500 : opts.size;
  const transparent = !!opts.transparent;
  const points = (pts) => pts.map((p) => p.join(",")).join(" ");
  const lidWidth = (face.haventSleptForDays ? 5.0 : 3.0) / face.faceScale;
  const rightTx =
    face.center[0] +
    face.distanceBetweenEyes +
    face.rightEyeOffsetX +
    " " +
    -(-face.center[1] + face.eyeHeightOffset + face.rightEyeOffsetY);
  const leftTx =
    -(face.center[0] + face.distanceBetweenEyes + face.leftEyeOffsetX) +
    " " +
    -(-face.center[1] + face.eyeHeightOffset + face.leftEyeOffsetY);
  const eyeDefs = (id, pts) =>
    `<clipPath id="${id}"><polyline points="${points(pts)}"/></clipPath>`;
  const lids = (side, tx, upper, lower, circles, shiftX, shiftY, clipId) => `
      <g transform="translate(${tx})">
        <polyline id="${side}Upper" points="${points(upper)}" fill="none" stroke="black" stroke-width="${lidWidth}" stroke-linejoin="round" stroke-linecap="round" filter="url(#fuzzy)"/>
        <polyline id="${side}Lower" points="${points(lower)}" fill="none" stroke="black" stroke-width="${lidWidth}" stroke-linejoin="round" stroke-linecap="round" filter="url(#fuzzy)"/>
        ${circles
          .map(
            (c) =>
              `<circle r="${c.r}" cx="${shiftX + c.dx}" cy="${shiftY + c.dy}" stroke="black" fill="none" stroke-width="${c.w}" filter="url(#fuzzy)" clip-path="url(#${clipId})"/>`,
          )
          .join("")}
      </g>`;
  const hairs = face.hairs
    .map(
      (hair, index) =>
        `<polyline points="${points(hair)}" fill="none" stroke="${face.hairColor}" stroke-width="${face.hairWidths[index]}" stroke-linejoin="round" filter="url(#fuzzy)"/>`,
    )
    .join("");
  const noseSvg = face.usePointNose
    ? `<g id="pointNose">
          <g id="rightNose">
            ${face.noseCirclesRight
              .map(
                (c) =>
                  `<circle r="${c.r}" cx="${face.rightNoseCenterX + c.dx}" cy="${face.rightNoseCenterY + c.dy}" stroke="black" fill="none" stroke-width="${c.w}" filter="url(#fuzzy)"/>`,
              )
              .join("")}
          </g>
          <g id="leftNose">
            ${face.noseCirclesLeft
              .map(
                (c) =>
                  `<circle r="${c.r}" cx="${face.leftNoseCenterX + c.dx}" cy="${face.leftNoseCenterY + c.dy}" stroke="black" fill="none" stroke-width="${c.w}" filter="url(#fuzzy)"/>`,
              )
              .join("")}
          </g>
        </g>`
    : `<g id="lineNose">
          <path d="M ${face.leftNoseCenterX} ${face.leftNoseCenterY}, Q${face.rightNoseCenterX} ${face.rightNoseCenterY * 1.5},${(face.leftNoseCenterX + face.rightNoseCenterX) / 2} ${-face.eyeHeightOffset * 0.2}" fill="none" stroke="black" stroke-width="${face.lineNoseWidth}" stroke-linejoin="round" filter="url(#fuzzy)"></path>
        </g>`;
  return `<svg viewBox="-100 -100 200 200" xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}">
      <defs>
        ${eyeDefs("leftEyeClipPath", face.eyeLeftCountour)}
        ${eyeDefs("rightEyeClipPath", face.eyeRightCountour)}
        <filter id="fuzzy">
          <feTurbulence id="turbulence" baseFrequency="0.05" numOctaves="3" type="noise" result="noise"/>
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="2"/>
        </filter>
        <linearGradient id="rainbowGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" style="stop-color: ${face.dyeColors[0]};  stop-opacity: 1"/>
          <stop offset="${face.dyeColorOffset == null ? "50%" : face.dyeColorOffset}" style="stop-color: ${face.dyeColors[1]};  stop-opacity: 1"/>
          <stop offset="100%" style="stop-color: ${face.dyeColors[2]};  stop-opacity: 1"/>
        </linearGradient>
      </defs>
      <title>That's an ugly face</title>
      <desc>CREATED BY XUAN TANG, MORE INFO AT TXSTC55.GITHUB.IO</desc>
      ${transparent ? "" : `<rect x="-100" y="-100" width="100%" height="100%" fill="${face.backgroundColor}"/>`}
      <polyline id="faceContour" points="${points(face.computedFacePoints)}" fill="#ffc9a9" stroke="black" stroke-width="${3.0 / face.faceScale}" stroke-linejoin="round" filter="url(#fuzzy)"/>
      <g transform="translate(${rightTx})">
        <polyline id="rightCountour" points="${points(face.eyeRightCountour)}" fill="white" stroke="white" stroke-width="${0.0 / face.faceScale}" stroke-linejoin="round" filter="url(#fuzzy)"/>
      </g>
      <g transform="translate(${leftTx})">
        <polyline id="leftCountour" points="${points(face.eyeLeftCountour)}" fill="white" stroke="white" stroke-width="${0.0 / face.faceScale}" stroke-linejoin="round" filter="url(#fuzzy)"/>
      </g>
      ${lids("right", rightTx, face.eyeRightUpper, face.eyeRightLower, face.pupilCirclesRight, face.rightPupilShiftX, face.rightPupilShiftY, "rightEyeClipPath")}
      ${lids("left", leftTx, face.eyeLeftUpper, face.eyeLeftLower, face.pupilCirclesLeft, face.leftPupilShiftX, face.leftPupilShiftY, "leftEyeClipPath")}
      <g id="hairs">${hairs}</g>
      ${noseSvg}
      <g id="mouth">
        <polyline points="${points(face.mouthPoints)}" fill="rgb(215,127,140)" stroke="black" stroke-width="${face.mouthWidth}" stroke-linejoin="round" filter="url(#fuzzy)"/>
      </g>
    </svg>`;
}

// Headless face generation: a port of FaceGenerator.vue's generateFace() with the Vue
// state removed. ORDER CONTRACT: the sequence of rng draws below defines a seed's face —
// never insert, remove or reorder a draw, or every previously shared seed URL changes.
import * as faceShape from "../utils/face_shape.js";
import * as eyeShape from "../utils/eye_shape.js";
import * as hairLines from "../utils/hair_lines.js";
import * as mouthShape from "../utils/mouth_shape.js";
import {
  next,
  chance,
  pick,
  setSeed,
  randomSeedString,
  randomFromInterval,
} from "../utils/rng.js";

export const HAIR_COLORS = [
  "rgb(0, 0, 0)", // Black
  "rgb(44, 34, 43)", // Dark Brown
  "rgb(80, 68, 68)", // Medium Brown
  "rgb(167, 133, 106)", // Light Brown
  "rgb(220, 208, 186)", // Blond
  "rgb(233, 236, 239)", // Platinum Blond
  "rgb(165, 42, 42)", // Red
  "rgb(145, 85, 61)", // Auburn
  "rgb(128, 128, 128)", // Grey
  "rgb(185, 55, 55)", // Fire
  "rgb(255, 192, 203)", // Pastel Pink
  "rgb(255, 105, 180)", // Bright Pink
  "rgb(230, 230, 250)", // Lavender
  "rgb(64, 224, 208)", // Turquoise
  "rgb(0, 191, 255)", // Bright Blue
  "rgb(148, 0, 211)", // Deep Purple
  "rgb(50, 205, 50)", // Lime Green
  "rgb(255, 165, 0)", // Vivid Orange
  "rgb(220, 20, 60)", // Crimson Red
  "rgb(192, 192, 192)", // Silver
  "rgb(255, 215, 0)", // Gold
  "rgb(255, 255, 255)", // White
  "rgb(124, 252, 0)", // Lawn Green
  "rgb(127, 255, 0)", // Chartreuse
  "rgb(0, 255, 127)", // Spring Green
  "rgb(72, 209, 204)", // Medium Turquoise
  "rgb(0, 255, 255)", // Cyan
  "rgb(0, 206, 209)", // Dark Turquoise
  "rgb(32, 178, 170)", // Light Sea Green
  "rgb(95, 158, 160)", // Cadet Blue
  "rgb(70, 130, 180)", // Steel Blue
  "rgb(176, 196, 222)", // Light Steel Blue
  "rgb(30, 144, 255)", // Dodger Blue
  "rgb(135, 206, 235)", // Sky Blue
  "rgb(0, 0, 139)", // Dark Blue
  "rgb(138, 43, 226)", // Blue Violet
  "rgb(75, 0, 130)", // Indigo
  "rgb(139, 0, 139)", // Dark Magenta
  "rgb(153, 50, 204)", // Dark Orchid
  "rgb(186, 85, 211)", // Medium Orchid
  "rgb(218, 112, 214)", // Orchid
  "rgb(221, 160, 221)", // Plum
  "rgb(238, 130, 238)", // Violet
  "rgb(255, 0, 255)", // Magenta
  "rgb(216, 191, 216)", // Thistle
  "rgb(255, 20, 147)", // Deep Pink
  "rgb(255, 69, 0)", // Orange Red
  "rgb(255, 140, 0)", // Dark Orange
  "rgb(255, 165, 0)", // Orange
  "rgb(250, 128, 114)", // Salmon
  "rgb(233, 150, 122)", // Dark Salmon
  "rgb(240, 128, 128)", // Light Coral
  "rgb(205, 92, 92)", // Indian Red
  "rgb(255, 99, 71)", // Tomato
  "rgb(255, 160, 122)", // Light Salmon
  "rgb(220, 20, 60)", // Crimson
  "rgb(139, 0, 0)", // Dark Red
  "rgb(178, 34, 34)", // Fire Brick
  "rgb(250, 235, 215)", // Antique White
  "rgb(255, 239, 213)", // Papaya Whip
  "rgb(255, 235, 205)", // Blanched Almond
  "rgb(255, 222, 173)", // Navajo White
  "rgb(245, 245, 220)", // Beige
  "rgb(255, 228, 196)", // Bisque
  "rgb(255, 218, 185)", // Peach Puff
  "rgb(244, 164, 96)", // Sandy Brown
  "rgb(210, 180, 140)", // Tan
  "rgb(222, 184, 135)", // Burly Wood
  "rgb(250, 250, 210)", // Light Goldenrod Yellow
  "rgb(255, 250, 205)", // Lemon Chiffon
  "rgb(255, 245, 238)", // Sea Shell
  "rgb(253, 245, 230)", // Old Lace
  "rgb(255, 228, 225)", // Misty Rose
  "rgb(255, 240, 245)", // Lavender Blush
  "rgb(250, 240, 230)", // Linen
];

export const BACKGROUND_COLORS = [
  "rgb(245, 245, 220)", // Soft Beige
  "rgb(176, 224, 230)", // Pale Blue
  "rgb(211, 211, 211)", // Light Grey
  "rgb(152, 251, 152)", // Pastel Green
  "rgb(255, 253, 208)", // Cream
  "rgb(230, 230, 250)", // Muted Lavender
  "rgb(188, 143, 143)", // Dusty Rose
  "rgb(135, 206, 235)", // Sky Blue
  "rgb(245, 255, 250)", // Mint Cream
  "rgb(245, 222, 179)", // Wheat
  "rgb(47, 79, 79)", // Dark Slate Gray
  "rgb(72, 61, 139)", // Dark Slate Blue
  "rgb(60, 20, 20)", // Dark Brown
  "rgb(25, 25, 112)", // Midnight Blue
  "rgb(139, 0, 0)", // Dark Red
  "rgb(85, 107, 47)", // Olive Drab
  "rgb(128, 0, 128)", // Purple
  "rgb(0, 100, 0)", // Dark Green
  "rgb(0, 0, 139)", // Dark Blue
  "rgb(105, 105, 105)", // Dim Gray
  "rgb(240, 128, 128)", // Light Coral
  "rgb(255, 160, 122)", // Light Salmon
  "rgb(255, 218, 185)", // Peach Puff
  "rgb(255, 228, 196)", // Bisque
  "rgb(255, 222, 173)", // Navajo White
  "rgb(255, 250, 205)", // Lemon Chiffon
  "rgb(250, 250, 210)", // Light Goldenrod Yellow
  "rgb(255, 239, 213)", // Papaya Whip
  "rgb(255, 245, 238)", // Sea Shell
  "rgb(255, 248, 220)", // Cornsilk
  "rgb(255, 255, 240)", // Ivory
  "rgb(240, 255, 240)", // Honeydew
  "rgb(240, 255, 255)", // Azure
  "rgb(240, 248, 255)", // Alice Blue
  "rgb(248, 248, 255)", // Ghost White
  "rgb(255, 250, 250)", // Snow
  "rgb(255, 240, 245)", // Lavender Blush
  "rgb(255, 228, 225)", // Misty Rose
  "rgb(230, 230, 250)", // Lavender
  "rgb(216, 191, 216)", // Thistle
  "rgb(221, 160, 221)", // Plum
  "rgb(238, 130, 238)", // Violet
  "rgb(218, 112, 214)", // Orchid
  "rgb(186, 85, 211)", // Medium Orchid
  "rgb(147, 112, 219)", // Medium Purple
  "rgb(138, 43, 226)", // Blue Violet
  "rgb(148, 0, 211)", // Dark Violet
  "rgb(153, 50, 204)", // Dark Orchid
  "rgb(139, 69, 19)", // Saddle Brown
  "rgb(160, 82, 45)", // Sienna
  "rgb(210, 105, 30)", // Chocolate
  "rgb(205, 133, 63)", // Peru
  "rgb(244, 164, 96)", // Sandy Brown
  "rgb(222, 184, 135)", // Burly Wood
  "rgb(255, 250, 240)", // Floral White
  "rgb(253, 245, 230)", // Old Lace
  "rgb(250, 240, 230)", // Linen
];

// Generates every field the SVG template needs as a plain object. Synchronous by design:
// it draws from the module-level seeded rng, so calls cannot interleave mid-generation.
export function generateFaceData(seed) {
  seed = seed || randomSeedString();
  setSeed(seed);
  const face = { seed };
  face.faceScale = 1.5 + next() * 0.6;
  face.haventSleptForDays = chance(0.2);
  let faceResults = faceShape.generateFaceCountourPoints();
  face.computedFacePoints = faceResults.face;
  face.faceHeight = faceResults.height;
  face.faceWidth = faceResults.width;
  face.center = faceResults.center;
  let eyes = eyeShape.generateBothEyes(face.faceWidth / 2);
  let left = eyes.left;
  let right = eyes.right;
  face.eyeRightUpper = right.upper;
  face.eyeRightLower = right.lower;
  face.eyeRightCountour = right.upper
    .slice(10, 90)
    .concat(right.lower.slice(10, 90).reverse());
  face.eyeLeftUpper = left.upper;
  face.eyeLeftLower = left.lower;
  face.eyeLeftCountour = left.upper
    .slice(10, 90)
    .concat(left.lower.slice(10, 90).reverse());
  face.distanceBetweenEyes = randomFromInterval(
    face.faceWidth / 4.5,
    face.faceWidth / 4,
  );
  face.eyeHeightOffset = randomFromInterval(
    face.faceHeight / 8,
    face.faceHeight / 6,
  );
  face.leftEyeOffsetX = randomFromInterval(
    -face.faceWidth / 20,
    face.faceWidth / 10,
  );
  face.leftEyeOffsetY = randomFromInterval(
    -face.faceHeight / 50,
    face.faceHeight / 50,
  );
  face.rightEyeOffsetX = randomFromInterval(
    -face.faceWidth / 20,
    face.faceWidth / 10,
  );
  face.rightEyeOffsetY = randomFromInterval(
    -face.faceHeight / 50,
    face.faceHeight / 50,
  );
  face.leftEyeCenter = left.center[0];
  face.rightEyeCenter = right.center[0];
  face.leftPupilShiftX = randomFromInterval(
    -face.faceWidth / 20,
    face.faceWidth / 20,
  );

  // now we generate the pupil shifts
  // we first pick a point from the upper eye lid
  let leftInd0 = Math.floor(randomFromInterval(10, left.upper.length - 10));
  let rightInd0 = Math.floor(
    randomFromInterval(10, right.upper.length - 10),
  );
  let leftInd1 = Math.floor(randomFromInterval(10, left.upper.length - 10));
  let rightInd1 = Math.floor(
    randomFromInterval(10, right.upper.length - 10),
  );
  let leftLerp = randomFromInterval(0.2, 0.8);
  let rightLerp = randomFromInterval(0.2, 0.8);

  face.leftPupilShiftY =
    left.upper[leftInd0][1] * leftLerp +
    left.lower[leftInd1][1] * (1 - leftLerp);
  face.rightPupilShiftY =
    right.upper[rightInd0][1] * rightLerp +
    right.lower[rightInd1][1] * (1 - rightLerp);
  face.leftPupilShiftX =
    left.upper[leftInd0][0] * leftLerp +
    left.lower[leftInd1][0] * (1 - leftLerp);
  face.rightPupilShiftX =
    right.upper[rightInd0][0] * rightLerp +
    right.lower[rightInd1][0] * (1 - rightLerp);

  var numHairLines = [];
  var numHairMethods = 4;
  for (var i = 0; i < numHairMethods; i++) {
    numHairLines.push(Math.floor(randomFromInterval(0, 50)));
  }
  face.hairs = [];
  if (chance(0.7)) {
    face.hairs = hairLines.generateHairLines0(
      face.computedFacePoints,
      numHairLines[0] * 1 + 10,
    );
  }
  if (chance(0.7)) {
    face.hairs = face.hairs.concat(
      hairLines.generateHairLines1(
        face.computedFacePoints,
        numHairLines[1] / 1.5 + 10,
      ),
    );
  }
  if (chance(0.5)) {
    face.hairs = face.hairs.concat(
      hairLines.generateHairLines2(
        face.computedFacePoints,
        numHairLines[2] * 3 + 10,
      ),
    );
  }
  if (chance(0.5)) {
    face.hairs = face.hairs.concat(
      hairLines.generateHairLines3(
        face.computedFacePoints,
        numHairLines[3] * 3 + 10,
      ),
    );
  }
  face.rightNoseCenterX = randomFromInterval(
    face.faceWidth / 18,
    face.faceWidth / 12,
  );
  face.rightNoseCenterY = randomFromInterval(0, face.faceHeight / 5);
  face.leftNoseCenterX = randomFromInterval(
    -face.faceWidth / 18,
    -face.faceWidth / 12,
  );
  face.leftNoseCenterY =
    face.rightNoseCenterY +
    randomFromInterval(-face.faceHeight / 30, face.faceHeight / 20);
  face.dyeColorOffset = "50%";
  if (chance(0.9)) {
    // use natural hair color
    face.hairColor = pick(HAIR_COLORS.slice(0, 10));
  } else {
    face.hairColor = "url(#rainbowGradient)";
    face.dyeColorOffset = randomFromInterval(0, 100) + "%";
  }

  var choice = Math.floor(next() * 3);
  if (choice == 0) {
    face.mouthPoints = mouthShape.generateMouthShape0(
      face.computedFacePoints,
      face.faceHeight,
      face.faceWidth,
    );
  } else if (choice == 1) {
    face.mouthPoints = mouthShape.generateMouthShape1(
      face.computedFacePoints,
      face.faceHeight,
      face.faceWidth,
    );
  } else {
    face.mouthPoints = mouthShape.generateMouthShape2(
      face.computedFacePoints,
      face.faceHeight,
      face.faceWidth,
    );
  }
  // Hoisted template randomness: drawn once per face in a fixed order (gradient colors, background, pupils R/L, hair widths, nose choice, nose dots, line/mouth widths).
  // The SVG builder must never draw rng itself, or every rebuild would re-roll the face and break the seed contract.
  face.dyeColors = [
    pick(HAIR_COLORS.slice(0, 10)),
    pick(HAIR_COLORS),
    pick(HAIR_COLORS),
  ];
  face.backgroundColor = pick(BACKGROUND_COLORS);
  const makePupilCircles = () =>
    Array.from({ length: 10 }, () => ({
      r: next() * 2 + 3.0,
      dx: next() * 5 - 2.5,
      dy: next() * 5 - 2.5,
      w: 1.0 + next() * 0.5,
    }));
  face.pupilCirclesRight = makePupilCircles();
  face.pupilCirclesLeft = makePupilCircles();
  face.hairWidths = face.hairs.map(() => 0.5 + next() * 2.5);
  face.usePointNose = chance(0.5);
  const makeNoseDots = () =>
    Array.from({ length: 10 }, () => ({
      r: next() * 2 + 1.0,
      dx: next() * 4 - 2,
      dy: next() * 4 - 2,
      w: 1.0 + next() * 0.5,
    }));
  face.noseCirclesRight = makeNoseDots();
  face.noseCirclesLeft = makeNoseDots();
  face.lineNoseWidth = 2.5 + next() * 1.0;
  face.mouthWidth = 2.7 + next() * 0.5;
  return face;
}

export interface FaceCircle {
  r: number;
  dx: number;
  dy: number;
  w: number;
}

export interface FaceData {
  seed: string;
  faceScale: number;
  haventSleptForDays: boolean;
  computedFacePoints: [number, number][];
  faceHeight: number;
  faceWidth: number;
  center: [number, number];
  eyeRightUpper: [number, number][];
  eyeRightLower: [number, number][];
  eyeRightCountour: [number, number][];
  eyeLeftUpper: [number, number][];
  eyeLeftLower: [number, number][];
  eyeLeftCountour: [number, number][];
  distanceBetweenEyes: number;
  eyeHeightOffset: number;
  leftEyeOffsetX: number;
  leftEyeOffsetY: number;
  rightEyeOffsetX: number;
  rightEyeOffsetY: number;
  leftEyeCenter: [number, number];
  rightEyeCenter: [number, number];
  leftPupilShiftX: number;
  leftPupilShiftY: number;
  rightPupilShiftX: number;
  rightPupilShiftY: number;
  hairs: [number, number][];
  hairWidths: number[];
  hairColor: string;
  dyeColors: [string, string, string];
  dyeColorOffset?: string;
  mouthPoints: [number, number][];
  mouthWidth: number;
  usePointNose: boolean;
  rightNoseCenterX: number;
  rightNoseCenterY: number;
  leftNoseCenterX: number;
  leftNoseCenterY: number;
  noseCirclesRight: FaceCircle[];
  noseCirclesLeft: FaceCircle[];
  lineNoseWidth: number;
  backgroundColor: string;
  pupilCirclesRight: FaceCircle[];
  pupilCirclesLeft: FaceCircle[];
}

export interface FaceOptions {
  size?: number;
  transparent?: boolean;
}

export declare function generateFaceData(seed?: string): FaceData;
export declare function faceDataToSVG(face: FaceData, opts?: FaceOptions): string;
export declare function generateFaceSVG(seed?: string, opts?: FaceOptions): string;
export declare function svgToDataURL(svgString: string): string;
export declare function generateFaceDataURL(seed?: string, opts?: FaceOptions): string;
export declare function generateFacePNG(seed?: string, opts?: FaceOptions): Promise<string>;
export declare function randomSeed(): string;
export declare const HAIR_COLORS: string[];
export declare const BACKGROUND_COLORS: string[];

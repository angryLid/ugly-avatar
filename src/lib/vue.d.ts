import type { ComputedRef, Ref } from "vue";
import type { FaceData } from "./index.d";

export interface UglyFaceHandle {
  seed: ComputedRef<string>;
  face: Ref<FaceData>;
  svg: ComputedRef<string>;
  dataUrl: ComputedRef<string>;
  regenerate(): void;
  setSeed(seed?: string): void;
}

export declare function useUglyFace(
  seed?: string | Ref<string | undefined> | (() => string | undefined),
): UglyFaceHandle;

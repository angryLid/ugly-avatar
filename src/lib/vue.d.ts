import type { ComputedRef, Ref } from "vue";
import type { FaceData } from "./index.d";

export interface UglyMugHandle {
  seed: ComputedRef<string>;
  face: Ref<FaceData>;
  svg: ComputedRef<string>;
  dataUrl: ComputedRef<string>;
  regenerate(): void;
  setSeed(seed?: string): void;
}

export declare function useUglyMug(
  seed?: string | Ref<string | undefined> | (() => string | undefined),
): UglyMugHandle;

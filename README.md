# ugly-face

This project is under Attribution-NonCommercial 4.0 International License. This means no commercial use for the project. I thought about this for a time. If you want to use this as part of your website that needs an avatar generator, you are free to use it. If you however, buid an app solely on this code as your main project, I am highly against that practice. I don't want to have the frustration of "oh someone copied my code and made money with it".

Visit the website: https://txstc55.github.io/ugly-avatar

I have seen a good amount of copycat websites. I am fairly disappointed.

## Use as a package

The generator ships on npm as `uglyface` — a framework-agnostic library built from this same source, so the package and the website always render identical faces for a seed. Every face is derived from its seed: the same seed always produces the same face.

```bash
npm install uglyface
```

```js
import { generateFaceSVG, generateFaceDataURL, generateFacePNG, randomSeed } from "uglyface";

const seed = randomSeed();
const svg = generateFaceSVG(seed);               // '<svg ...>...</svg>'
const b64 = generateFaceDataURL(seed);           // 'data:image/svg+xml;base64,...' for <img src>
const png = await generateFacePNG(seed, { size: 512 }); // browser-only canvas rasterization
```

Options: `{ size, transparent }` — `size` sets the SVG width/height (default 500), `transparent: true` drops the background rect. You can also generate the raw data and render it yourself: `generateFaceData(seed)` plus `faceDataToSVG(face, opts)`.

### Vue 3

```js
import { useUglyFace } from "uglyface/vue";

const { seed, svg, dataUrl, regenerate, setSeed } = useUglyFace();
```

```html
<div v-html="svg"></div>
<!-- or -->
<img :src="dataUrl" alt="ugly avatar" />
<button @click="regenerate">ANOTHER</button>
```

`useUglyFace` also accepts a string, a ref, or a getter as the initial seed, and `setSeed(s)` loads a specific seed.

### React

The core API is plain functions, so a hook is one line:

```js
const svg = useMemo(() => generateFaceSVG(seed), [seed]);
```

### Node

`generateFaceSVG` and `generateFaceDataURL` work in Node out of the box. `generateFacePNG` needs a browser canvas; in Node, rasterize the SVG string yourself, e.g. with [resvg-js](https://github.com/yisibl/resvg-js):

```js
import { Resvg } from "@resvg/resvg-js";
import { generateFaceSVG } from "uglyface";

const png = new Resvg(generateFaceSVG(seed), { fitTo: { mode: "width", value: 512 } })
  .render()
  .asPng();
```

### Types & builds

TypeScript declarations are included; both ESM and CJS builds ship in `lib/`. `vue` is an optional peer dependency — only needed for `uglyface/vue`.

Note: the older npm packages `ugly-face` and `ugly-avatar` are unofficial third-party ports; `uglyface` is the official package built from this repository.

## Development (this repository)

```bash
npm install
npm run serve       # demo app
npm run build       # build the demo
npm run build:lib   # build the npm package into lib/
npm test            # run the library tests
```

Faces are reproducible and shareable: the site restores the face from the `?seed=` URL parameter, and the same seed renders the same face through the npm package.

import { build } from "esbuild";
import { copyFileSync, mkdirSync } from "node:fs";

// Outputs to lib/ (not dist/) so the npm package never collides with the vue-cli demo build in dist/.
mkdirSync("lib", { recursive: true });

const common = {
  bundle: true,
  target: ["es2018"],
  minify: false,
  sourcemap: false,
  logLevel: "info",
};

const targets = [
  { entry: "src/lib/index.js", name: "index", external: ["seedrandom"] },
  { entry: "src/lib/vue.js", name: "vue", external: ["seedrandom", "vue"] },
];

for (const t of targets) {
  await build({ ...common, entryPoints: [t.entry], format: "esm", external: t.external, outfile: `lib/${t.name}.mjs` });
  await build({ ...common, entryPoints: [t.entry], format: "cjs", external: t.external, outfile: `lib/${t.name}.cjs` });
}

copyFileSync("src/lib/index.d.ts", "lib/index.d.ts");
copyFileSync("src/lib/vue.d.ts", "lib/vue.d.ts");
console.log("lib built into lib/");

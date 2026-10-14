import { copyFile, mkdir } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { createRequire } from "node:module";

// MapLibre 6 uses an ESM worker. Serve it and its shared module from the same
// origin so Next's bundler does not rewrite its import.meta worker URL.
const require = createRequire(import.meta.url);
const packageDir = dirname(require.resolve("maplibre-gl/package.json"));
const dist = resolve(packageDir, "dist");
const output = resolve("public/vendor/maplibre");
await mkdir(output, { recursive: true });
for (const file of ["maplibre-gl-worker.mjs", "maplibre-gl-shared.mjs"]) {
  await copyFile(resolve(dist, file), resolve(output, file));
}
await copyFile(
  resolve(packageDir, "LICENSE.txt"),
  resolve(output, "LICENSE.txt"),
);

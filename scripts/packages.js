// Shared layout knowledge for the build script and the test suite.
import { readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";

// Language -> workspace package holding its shaders.
export const packages = { glsl: "glsl-tone-map", wgsl: "wgsl-tone-map" };

export const packageUrl = (language) =>
  new URL(`../packages/${packages[language]}/`, import.meta.url);

export const operators = (language) =>
  readdirSync(fileURLToPath(packageUrl(language)))
    .filter((file) => file.endsWith(`.${language}.js`))
    .map((file) => file.replace(`.${language}.js`, ""));

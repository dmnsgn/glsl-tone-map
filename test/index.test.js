import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import test from "node:test";
import { fileURLToPath } from "node:url";

import { operators, packages, packageUrl } from "../scripts/packages.js";

const root = fileURLToPath(new URL("../", import.meta.url));

const run = (command, args) => {
  try {
    return execFileSync(command, args, {
      cwd: root,
      encoding: "utf8",
      stdio: "pipe",
    });
  } catch ({ stdout, stderr, message }) {
    assert.fail(`${[command, ...args].join(" ")}\n${stderr || stdout || message}`);
  }
};

test("glslify bundles every operator", () => {
  run("npx", ["glslify", "test/index.glsl"]);
});

// The plain shader files duplicate the module strings, so they rot silently
// when only the .js side is edited. Only .glsl carries the glslify pragma.
for (const language of Object.keys(packages)) {
  test(`.${language} files match their .${language}.js counterpart`, async () => {
    const dirUrl = packageUrl(language);
    const dir = fileURLToPath(dirUrl);
    const names = operators(language);

    assert.ok(names.length, `no .${language}.js files found`);

    for (const name of names) {
      const { default: source } = await import(
        new URL(`${name}.${language}.js`, dirUrl)
      );
      const file = readFileSync(`${dir}${name}.${language}`, "utf8").replace(
        /#pragma glslify: export\(\w+\)\s*$/,
        "",
      );
      // Surrounding blank lines differ freely between the two, the code must not.
      assert.ok(
        file.trim() === source.trim(),
        `${name}.${language} is out of sync with ${name}.${language}.js`,
      );
    }
  });
}

// The packages ship separately, so nothing but this stops one language from
// gaining an operator the other never gets. Compares file and export names,
// not the function identifiers inside the shaders: those legitimately differ
// where WGSL has no overloading (acesScalar, hejlCurve, uchimuraCurve).
test("every operator exists in both languages", async () => {
  const [glsl, wgsl] = Object.keys(packages).map((language) =>
    operators(language).sort(),
  );

  assert.deepEqual(glsl, wgsl, "operator files differ between packages");

  const exports = await Promise.all(
    Object.keys(packages).map(async (language) =>
      Object.keys(await import(new URL("index.js", packageUrl(language)))).sort(),
    ),
  );

  assert.deepEqual(...exports, "barrel exports differ between packages");
});

test("WGSL compiles", (t) => {
  try {
    execFileSync("deno", ["--version"], { stdio: "ignore" });
  } catch {
    return t.skip("deno not installed, skipping WGSL validation");
  }
  run("deno", ["run", "--unstable-webgpu", "--allow-read", "test/wgsl-validate.js"]);
});

import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import { operators, packages, packageUrl } from "../scripts/packages.js";

const root = fileURLToPath(new URL("../", import.meta.url));

const run = (command, args, input) => {
  try {
    return execFileSync(command, args, {
      cwd: root,
      encoding: "utf8",
      input,
      stdio: "pipe",
    });
  } catch ({ stdout, stderr, message }) {
    assert.fail(`${[command, ...args].join(" ")}\n${stderr || stdout || message}`);
  }
};

// Built from the directory listing rather than kept as a fixture: a hand
// written one stops covering an operator the moment a new file lands. glslify
// resolves stdin relative to the cwd. It concatenates without parsing, so this
// covers the require paths and the export pragmas only; "GLSL compiles" below
// is what rejects invalid shader code.
test("glslify resolves every operator", () => {
  const names = operators("glsl");
  const require = (name) =>
    `#pragma glslify: ${name} = require(./packages/${packages.glsl}/${name})`;

  const bundle = run(
    "npx",
    ["glslify"],
    `${names.map(require).join("\n")}

void main() {
${names.map((name) => `  gl_FragColor.rgb = ${name}(gl_FragColor.rgb);`).join("\n")}
}`,
  );

  assert.ok(bundle.trim(), "glslify produced an empty bundle");
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

// Each operator is compiled on its own, as GLSL ES 1.00 for the WebGL target,
// wrapped in the minimum a fragment shader needs to reach its entry point.
test("GLSL compiles", async (t) => {
  try {
    execFileSync("glslangValidator", ["--version"], { stdio: "ignore" });
  } catch {
    return t.skip("glslangValidator not installed, skipping GLSL validation");
  }

  const dirUrl = packageUrl("glsl");
  const dir = mkdtempSync(join(tmpdir(), "glsl-tone-map-"));

  try {
    for (const name of operators("glsl")) {
      const { default: source } = await import(new URL(`${name}.glsl.js`, dirUrl));
      const file = join(dir, `${name}.frag`);

      writeFileSync(
        file,
        `#version 100
precision highp float;
${source}
void main() { gl_FragColor = vec4(${name}(vec3(0.5)), 1.0); }
`,
      );

      run("glslangValidator", [file]);
    }
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test("WGSL compiles", (t) => {
  try {
    execFileSync("deno", ["--version"], { stdio: "ignore" });
  } catch {
    return t.skip("deno not installed, skipping WGSL validation");
  }
  run("deno", ["run", "--unstable-webgpu", "--allow-read", "test/wgsl-validate.js"]);
});

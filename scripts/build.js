// Regenerates the plain shader files from the *.glsl.js / *.wgsl.js module
// strings, which are the single source of truth. Run after editing a shader;
// `npm test` fails when the two drift apart.
import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

import { operators, packages, packageUrl } from "./packages.js";

// glslify resolves an operator through an explicit export pragma. WGSL has no
// equivalent, so those files stay a verbatim mirror of the module string.
const footer = {
  glsl: (name) => `\n\n#pragma glslify: export(${name})\n`,
  wgsl: () => "",
};

for (const language of Object.keys(packages)) {
  const dirUrl = packageUrl(language);
  const dir = fileURLToPath(dirUrl);
  const names = operators(language);

  for (const name of names) {
    const { default: source } = await import(
      new URL(`${name}.${language}.js`, dirUrl)
    );
    const pragma = footer[language](name);

    writeFileSync(
      `${dir}${name}.${language}`,
      `${pragma ? source.replace(/\s*$/, "") : source}${pragma}`,
    );
  }

  console.log(`${names.length} .${language} files`);
}

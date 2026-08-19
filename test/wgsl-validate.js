// Validates every *.wgsl.js module string against a real WGSL implementation.
// Run via `npm test`; needs deno on PATH for its WebGPU (naga) support.
// Naga validates uncalled functions too, so compiling each module standalone
// covers every operator without a hand-maintained list of call sites.
const dirUrl = new URL("../packages/wgsl-tone-map/", import.meta.url);

const adapter = await navigator.gpu.requestAdapter();

if (!adapter) {
  console.error("no WebGPU adapter available");
  Deno.exit(1);
}

const device = await adapter.requestDevice();

const names = [...Deno.readDirSync(dirUrl)]
  .map(({ name }) => name)
  .filter((name) => name.endsWith(".wgsl.js"))
  .sort();

let failed = 0;

for (const name of names) {
  const { default: code } = await import(new URL(name, dirUrl).href);

  device.pushErrorScope("validation");
  const module = device.createShaderModule({ code });
  const { messages } = await module.getCompilationInfo();
  const scope = await device.popErrorScope();

  const errors = messages.filter(({ type }) => type === "error");

  if (scope || errors.length) {
    failed++;
    console.error(`✘ ${name}`);
    for (const { lineNum, linePos, message } of errors) {
      console.error(`  ${lineNum}:${linePos} ${message}`);
    }
    if (scope) console.error(`  ${scope.message}`);
  } else {
    console.log(`✔ ${name}`);
  }
}

Deno.exit(failed);

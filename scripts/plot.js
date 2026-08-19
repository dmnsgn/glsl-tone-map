/* global Deno */
import { operators, packageUrl } from "./packages.js";

const SAMPLES = 128;
const X_MAX = 4; // linear input; covers the knee and the overshoot above white
const Y_MAX = 1.25;

const PLOT = { w: 170, h: 110 };
const GAP = { x: 24, y: 30 };
const MARGIN = { top: 26, right: 20, bottom: 48, left: 48 };

const names = operators("wgsl").toSorted((a, b) => a.localeCompare(b));

// Whichever column count leaves the fewest empty cells, ties going to the
// fewest columns so panels stay as wide as possible. Fixing it at 4 stranded a
// lone panel above three empty cells as soon as the count reached 13.
const COLS = [4, 5, 6]
  .map((cols) => ({ cols, spare: (cols - (names.length % cols)) % cols }))
  .reduce((best, candidate) =>
    candidate.spare < best.spare ? candidate : best,
  ).cols;

const dirUrl = packageUrl("wgsl");
const sources = await Promise.all(
  names.map(
    async (name) => (await import(new URL(`${name}.wgsl.js`, dirUrl))).default,
  ),
);

// Every operator's entry point is named after its file, so the switch is generated.
const code = `${sources.join("\n")}

@group(0) @binding(0) var<storage, read_write> result: array<f32>;
override OP: u32 = 0u;

@compute @workgroup_size(64)
fn main(@builtin(global_invocation_id) gid: vec3u) {
  let i = gid.x;
  let n = arrayLength(&result);
  if (i >= n) { return; }

  let x = ${X_MAX}.0 * f32(i) / f32(n - 1u);
  var o = 0.0;
  switch OP {
${names.map((name, i) => `    case ${i}u: { o = ${name}(vec3f(x)).r; }`).join("\n")}
    default: { o = x; }
  }
  result[i] = o;
}`;

const adapter = await navigator.gpu.requestAdapter();

if (!adapter) {
  console.error("no WebGPU adapter available");
  Deno.exit(1);
}

const device = await adapter.requestDevice();

device.pushErrorScope("validation");
const module = device.createShaderModule({ code });
const scope = await device.popErrorScope();

if (scope) {
  console.error(scope.message);
  Deno.exit(1);
}

const bytes = SAMPLES * Float32Array.BYTES_PER_ELEMENT;
const storage = device.createBuffer({
  size: bytes,
  usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC,
});
const staging = device.createBuffer({
  size: bytes,
  usage: GPUBufferUsage.MAP_READ | GPUBufferUsage.COPY_DST,
});

const curves = [];

for (let op = 0; op < names.length; op++) {
  const pipeline = device.createComputePipeline({
    layout: "auto",
    compute: { module, entryPoint: "main", constants: { OP: op } },
  });
  const bindGroup = device.createBindGroup({
    layout: pipeline.getBindGroupLayout(0),
    entries: [{ binding: 0, resource: { buffer: storage } }],
  });

  const encoder = device.createCommandEncoder();
  const pass = encoder.beginComputePass();
  pass.setPipeline(pipeline);
  pass.setBindGroup(0, bindGroup);
  pass.dispatchWorkgroups(Math.ceil(SAMPLES / 64));
  pass.end();
  encoder.copyBufferToBuffer(storage, 0, staging, 0, bytes);
  device.queue.submit([encoder.finish()]);

  await staging.mapAsync(GPUMapMode.READ);
  curves.push([...new Float32Array(staging.getMappedRange().slice(0))]);
  staging.unmap();
}

const rows = Math.ceil(names.length / COLS);
// Any leftover cells sit at the end of the top row rather than the bottom one,
// so the bottom row is always full and its x-axis labels line up across every
// column. Column 0 stays populated, so the y-axis labels line up too.
const spare = rows > 1 ? rows * COLS - names.length : 0;
const width = MARGIN.left + COLS * PLOT.w + (COLS - 1) * GAP.x + MARGIN.right;
const height = MARGIN.top + rows * PLOT.h + (rows - 1) * GAP.y + MARGIN.bottom;

const cellFor = (i) => (i < COLS - spare ? i : i + spare);
const originOf = (cell) => ({
  col: cell % COLS,
  row: Math.floor(cell / COLS),
  x: MARGIN.left + (cell % COLS) * (PLOT.w + GAP.x),
  y: MARGIN.top + Math.floor(cell / COLS) * (PLOT.h + GAP.y),
});

const sx = (x) => (x / X_MAX) * PLOT.w;
const sy = (y) => PLOT.h - (y / Y_MAX) * PLOT.h;

const polylines = curves.map((curve) =>
  curve
    .map(
      (y, i) =>
        `${sx((X_MAX * i) / (SAMPLES - 1)).toFixed(1)},${sy(y).toFixed(1)}`,
    )
    .join(" "),
);

const xTicks = [0, 1, 2, 3, 4];
const yTicks = [0, 0.5, 1];

const titleOf = (name) =>
  name.replace(/([a-z])([A-Z])/g, "$1 $2").toUpperCase();

const defs = `  <defs>
    <clipPath id="panel"><rect x="0" y="0" width="${PLOT.w}" height="${PLOT.h}"/></clipPath>
    <g id="ghosts" class="ghost">
${polylines.map((p) => `      <polyline points="${p}"/>`).join("\n")}
    </g>
  </defs>`;

const panels = names
  .map((name, i) => {
    const { col, row, x, y } = originOf(cellFor(i));

    const yLabels =
      col === 0
        ? yTicks
            .map(
              (t) =>
                `    <text class="tick tick-y" x="-8" y="${(sy(t) + 3.5).toFixed(1)}">${t.toFixed(1)}</text>`,
            )
            .join("\n")
        : "";
    const xLabels =
      row === rows - 1
        ? xTicks
            .map(
              (t) =>
                `    <text class="tick tick-x" x="${sx(t).toFixed(1)}" y="${PLOT.h + 16}">${t}</text>`,
            )
            .join("\n")
        : "";

    return `  <g transform="translate(${x} ${y})">
    <text class="panel-title" x="0" y="0">${titleOf(name)}</text>
    <g class="grid">
${yTicks.map((t) => `      <line x1="0" y1="${sy(t).toFixed(1)}" x2="${PLOT.w}" y2="${sy(t).toFixed(1)}"/>`).join("\n")}
    </g>
    <g clip-path="url(#panel)">
      <use href="#ghosts"/>
      <polyline class="curve" points="${polylines[i]}"/>
    </g>
    <line class="axis" x1="0" y1="${PLOT.h}" x2="${PLOT.w}" y2="${PLOT.h}"/>
${yLabels}
${xLabels}
  </g>`;
  })
  .join("\n");

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}" role="img" aria-label="Response curves for ${names.length} tone mapping operators, linear input (0 to ${X_MAX}) against linear output. Each panel highlights one operator; the others repeat in grey for comparison.">
  <style>
    .surface { fill: #ffffff; }
    .panel-title { fill: #1f1f1f; font-family: Georgia, "Times New Roman", Times, serif; font-size: 12px; letter-spacing: 0.07em; }
    .tick { fill: #6d6d6d; font-family: Menlo, Consolas, "DejaVu Sans Mono", monospace; font-size: 10px; }
    .tick-y { text-anchor: end; }
    .tick-x { text-anchor: middle; }
    .grid line { stroke: #f2f2f2; stroke-width: 1; }
    .axis { stroke: #a39179; stroke-width: 1; }
    .ghost { fill: none; stroke: #6d6d6d; stroke-width: 1; stroke-opacity: 0.35; stroke-linejoin: round; stroke-linecap: round; }
    .curve { fill: none; stroke: #95171d; stroke-width: 2; stroke-linejoin: round; stroke-linecap: round; }

    @media (prefers-color-scheme: dark) {
      .surface { fill: #2b2119; }
      .panel-title { fill: #ffffff; }
      .tick { fill: #a39179; }
      .grid line { stroke: #404040; }
      .axis { stroke: #6d6d6d; }
      .ghost { stroke-opacity: 0.55; }
      .curve { stroke: #c98b8e; }
    }
  </style>
${defs}
  <rect class="surface" width="${width}" height="${height}"/>
${panels}
</svg>
`;

const out = new URL("../screenshot.svg", import.meta.url);
Deno.writeTextFileSync(out, svg);
console.log(
  `${names.length} curves -> screenshot.svg (${(svg.length / 1024).toFixed(1)}kB)`,
);

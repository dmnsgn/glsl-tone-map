export default /* wgsl */ `// Reinhard driven by luminance, then blended per channel by the per channel
// result, so saturated colors keep their hue instead of skewing towards
// whichever channel compresses first
// https://64.github.io/tonemapping/#reinhard-jodie
fn reinhardJodie(x: vec3f) -> vec3f {
  const lw = vec3f(0.2126, 0.7152, 0.0722);

  let l = dot(x, lw);
  let tv = x / (1.0 + x);

  return mix(x / (1.0 + l), tv, tv);
}

`;

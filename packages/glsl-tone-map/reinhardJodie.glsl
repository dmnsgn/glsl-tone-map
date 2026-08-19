// Reinhard driven by luminance, then blended per channel by the per channel
// result, so saturated colors keep their hue instead of skewing towards
// whichever channel compresses first
// https://64.github.io/tonemapping/#reinhard-jodie
vec3 reinhardJodie(vec3 x) {
  const vec3 lw = vec3(0.2126, 0.7152, 0.0722);

  float l = dot(x, lw);
  vec3 tv = x / (1.0 + x);

  return mix(x / (1.0 + l), tv, tv);
}

#pragma glslify: export(reinhardJodie)

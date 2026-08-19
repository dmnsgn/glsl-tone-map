// Khronos PBR Neutral Tone Mapper
// https://github.com/KhronosGroup/ToneMapping/tree/main/PBR_Neutral

// Input color is non-negative and resides in the Linear Rec. 709 color space.
// Output color is also Linear Rec. 709, but in the [0, 1] range.
fn neutral(inputColor: vec3f) -> vec3f {
  const startCompression: f32 = 0.8 - 0.04;
  const desaturation: f32 = 0.15;

  var color = inputColor;

  let x = min(color.r, min(color.g, color.b));
  let offset = select(0.04, x - 6.25 * x * x, x < 0.08);
  color -= offset;

  let peak = max(color.r, max(color.g, color.b));
  if (peak < startCompression) { return color; }

  const d: f32 = 1.0 - startCompression;
  let newPeak = 1.0 - d * d / (peak + d - startCompression);
  color *= newPeak / peak;

  let g = 1.0 - 1.0 / (desaturation * (peak - newPeak) + 1.0);
  return mix(color, vec3f(newPeak), g);
}


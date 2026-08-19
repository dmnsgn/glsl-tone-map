// Missing Deadlines (Benjamin Wrensch): https://iolite-engine.com/blog_posts/minimal_agx_implementation
// Filament: https://github.com/google/filament/blob/main/filament/src/ToneMapper.cpp#L263
// https://github.com/EaryChow/AgX_LUT_Gen/blob/main/AgXBaseRec2020.py

// Three.js: https://github.com/mrdoob/three.js/blob/4993e3af579a27cec950401b523b6e796eab93ec/src/renderers/shaders/ShaderChunk/tonemapping_pars_fragment.glsl.js#L79-L89
// Matrices for rec 2020 <> rec 709 color space conversion
// matrix provided in row-major order so it has been transposed
// https://www.itu.int/pub/R-REP-BT.2407-2017
const LINEAR_REC2020_TO_LINEAR_SRGB = mat3x3f(
  1.6605, -0.1246, -0.0182,
  -0.5876, 1.1329, -0.1006,
  -0.0728, -0.0083, 1.1187
);

const LINEAR_SRGB_TO_LINEAR_REC2020 = mat3x3f(
  0.6274, 0.0691, 0.0164,
  0.3293, 0.9195, 0.0880,
  0.0433, 0.0113, 0.8956
);

// Converted to column major from blender: https://github.com/blender/blender/blob/fc08f7491e7eba994d86b610e5ec757f9c62ac81/release/datafiles/colormanagement/config.ocio#L358
const AgXInsetMatrix = mat3x3f(
  0.856627153315983, 0.137318972929847, 0.11189821299995,
  0.0951212405381588, 0.761241990602591, 0.0767994186031903,
  0.0482516061458583, 0.101439036467562, 0.811302368396859
);

// Converted to column major and inverted from https://github.com/EaryChow/AgX_LUT_Gen/blob/ab7415eca3cbeb14fd55deb1de6d7b2d699a1bb9/AgXBaseRec2020.py#L25
// https://github.com/google/filament/blob/bac8e58ee7009db4d348875d274daf4dd78a3bd1/filament/src/ToneMapper.cpp#L273-L278
const AgXOutsetMatrix = mat3x3f(
  1.1271005818144368, -0.1413297634984383, -0.14132976349843826,
  -0.11060664309660323, 1.157823702216272, -0.11060664309660294,
  -0.016493938717834573, -0.016493938717834257, 1.2519364065950405
);

const AgxMinEv: f32 = -12.47393;
const AgxMaxEv: f32 = 4.026069;

// Sample usage
fn agxCdl(inputColor: vec3f, slope: vec3f, offset: vec3f, power: vec3f, saturation: f32) -> vec3f {
  var color = LINEAR_SRGB_TO_LINEAR_REC2020 * inputColor; // From three.js

  // 1. agx()
  // Input transform (inset)
  color = AgXInsetMatrix * color;

  color = max(color, vec3f(1e-10)); // From Filament: avoid 0 or negative numbers for log2

  // Log2 space encoding
  color = clamp(log2(color), vec3f(AgxMinEv), vec3f(AgxMaxEv));
  color = (color - AgxMinEv) / (AgxMaxEv - AgxMinEv);

  color = clamp(color, vec3f(0.0), vec3f(1.0)); // From Filament

  // Apply sigmoid function approximation
  // Mean error^2: 3.6705141e-06
  let x2 = color * color;
  let x4 = x2 * x2;
  color = 15.5      * x4 * x2
          - 40.14   * x4 * color
          + 31.96   * x4
          - 6.868   * x2 * color
          + 0.4298  * x2
          + 0.1191  * color
          - 0.00232;

  // 2. agxLook()
  color = pow(color * slope + offset, power);
  const lw = vec3f(0.2126, 0.7152, 0.0722);
  let luma = dot(color, lw);
  color = luma + saturation * (color - luma);

  // 3. agxEotf()
  // Inverse input transform (outset)
  color = AgXOutsetMatrix * color;

  // sRGB IEC 61966-2-1 2.2 Exponent Reference EOTF Display
  // NOTE: We're linearizing the output here. Comment/adjust when
  // *not* using a sRGB render target
  color = pow(max(vec3f(0.0), color), vec3f(2.2)); // From filament: max()

  color = LINEAR_REC2020_TO_LINEAR_SRGB * color; // From three.js
  // Gamut mapping. Simple clamp for now.
  color = clamp(color, vec3f(0.0), vec3f(1.0));

  return color;
}

fn agx(color: vec3f) -> vec3f {
  return agxCdl(color, vec3f(1.0), vec3f(0.0), vec3f(1.0), 1.0);
}

fn agxGolden(color: vec3f) -> vec3f {
  return agxCdl(color, vec3f(1.0, 0.9, 0.5), vec3f(0.0), vec3f(0.8), 1.3);
}

fn agxPunchy(color: vec3f) -> vec3f {
  return agxCdl(color, vec3f(1.0), vec3f(0.0), vec3f(1.35), 1.4);
}

fn agxNeedle(color: vec3f) -> vec3f {
  return agxCdl(color, vec3f(1.05), vec3f(0.0), vec3f(1.1), 1.15);
}

export default /* wgsl */ `// Stephen Hill (@self_shadow): fit of the full ACES RRT + ODT, unlike the
// luminance-only curve in aces()
// https://github.com/TheRealMJP/BakingLab/blob/master/BakingLab/ACES.hlsl

// Matrices provided in row-major order so they have been transposed
// sRGB => XYZ => D65_2_D60 => AP1 => RRT_SAT
const ACESInputMat = mat3x3f(
  0.59719, 0.07600, 0.02840,
  0.35458, 0.90834, 0.13383,
  0.04823, 0.01566, 0.83777
);

// ODT_SAT => XYZ => D60_2_D65 => sRGB
const ACESOutputMat = mat3x3f(
  1.60475, -0.10208, -0.00327,
  -0.53108, 1.10813, -0.07276,
  -0.07367, -0.00605, 1.07602
);

fn RRTAndODTFit(v: vec3f) -> vec3f {
  let a = v * (v + 0.0245786) - 0.000090537;
  let b = v * (0.983729 * v + 0.4329510) + 0.238081;
  return a / b;
}

fn acesHill(inputColor: vec3f) -> vec3f {
  var color = ACESInputMat * inputColor;
  color = RRTAndODTFit(color);
  color = ACESOutputMat * color;
  return clamp(color, vec3f(0.0), vec3f(1.0));
}

`;

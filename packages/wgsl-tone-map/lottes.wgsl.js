export default /* wgsl */ `// Lottes 2016, "Advanced Techniques and Optimization of HDR Color Pipelines"
fn lottes(x: vec3f) -> vec3f {
  const a = vec3f(1.6);
  const d = vec3f(0.977);
  const hdrMax = vec3f(8.0);
  const midIn = vec3f(0.18);
  const midOut = vec3f(0.267);

  // let, not const: pow() const-evaluation is uneven across implementations
  let b =
      (-pow(midIn, a) + pow(hdrMax, a) * midOut) /
      ((pow(hdrMax, a * d) - pow(midIn, a * d)) * midOut);
  let c =
      (pow(hdrMax, a * d) * pow(midIn, a) - pow(hdrMax, a) * pow(midIn, a * d) * midOut) /
      ((pow(hdrMax, a * d) - pow(midIn, a * d)) * midOut);

  return pow(x, a) / (pow(x, a * d) * b + c);
}

fn lottesScalar(x: f32) -> f32 {
  const a: f32 = 1.6;
  const d: f32 = 0.977;
  const hdrMax: f32 = 8.0;
  const midIn: f32 = 0.18;
  const midOut: f32 = 0.267;

  let b =
      (-pow(midIn, a) + pow(hdrMax, a) * midOut) /
      ((pow(hdrMax, a * d) - pow(midIn, a * d)) * midOut);
  let c =
      (pow(hdrMax, a * d) * pow(midIn, a) - pow(hdrMax, a) * pow(midIn, a * d) * midOut) /
      ((pow(hdrMax, a * d) - pow(midIn, a * d)) * midOut);

  return pow(x, a) / (pow(x, a * d) * b + c);
}

`;

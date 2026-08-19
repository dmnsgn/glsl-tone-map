export default /* wgsl */ `// Filmic Tonemapping Operators http://filmicworlds.com/blog/filmic-tonemapping-operators/
fn filmic(x: vec3f) -> vec3f {
  let X = max(vec3f(0.0), x - 0.004);
  let result = (X * (6.2 * X + 0.5)) / (X * (6.2 * X + 1.7) + 0.06);
  return pow(result, vec3f(2.2));
}

fn filmicScalar(x: f32) -> f32 {
  let X = max(0.0, x - 0.004);
  let result = (X * (6.2 * X + 0.5)) / (X * (6.2 * X + 1.7) + 0.06);
  return pow(result, 2.2);
}

`;

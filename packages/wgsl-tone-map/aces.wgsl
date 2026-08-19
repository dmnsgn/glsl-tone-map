// Narkowicz 2015, "ACES Filmic Tone Mapping Curve"
fn aces(x: vec3f) -> vec3f {
  const a: f32 = 2.51;
  const b: f32 = 0.03;
  const c: f32 = 2.43;
  const d: f32 = 0.59;
  const e: f32 = 0.14;
  return clamp((x * (a * x + b)) / (x * (c * x + d) + e), vec3f(0.0), vec3f(1.0));
}

fn acesScalar(x: f32) -> f32 {
  const a: f32 = 2.51;
  const b: f32 = 0.03;
  const c: f32 = 2.43;
  const d: f32 = 0.59;
  const e: f32 = 0.14;
  return clamp((x * (a * x + b)) / (x * (c * x + d) + e), 0.0, 1.0);
}


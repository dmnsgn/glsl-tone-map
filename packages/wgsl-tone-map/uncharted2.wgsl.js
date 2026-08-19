export default /* wgsl */ `fn uncharted2Curve(x: vec3f) -> vec3f {
  const A: f32 = 0.15;
  const B: f32 = 0.50;
  const C: f32 = 0.10;
  const D: f32 = 0.20;
  const E: f32 = 0.02;
  const F: f32 = 0.30;
  return ((x * (A * x + C * B) + D * E) / (x * (A * x + B) + D * F)) - E / F;
}

fn uncharted2(color: vec3f) -> vec3f {
  const W: f32 = 11.2;
  const exposureBias: f32 = 2.0;
  let curr = uncharted2Curve(exposureBias * color);
  let whiteScale = 1.0 / uncharted2Curve(vec3f(W));
  return curr * whiteScale;
}

fn uncharted2CurveScalar(x: f32) -> f32 {
  const A: f32 = 0.15;
  const B: f32 = 0.50;
  const C: f32 = 0.10;
  const D: f32 = 0.20;
  const E: f32 = 0.02;
  const F: f32 = 0.30;
  return ((x * (A * x + C * B) + D * E) / (x * (A * x + B) + D * F)) - E / F;
}

fn uncharted2Scalar(color: f32) -> f32 {
  const W: f32 = 11.2;
  const exposureBias: f32 = 2.0;
  let curr = uncharted2CurveScalar(exposureBias * color);
  let whiteScale = 1.0 / uncharted2CurveScalar(W);
  return curr * whiteScale;
}

`;

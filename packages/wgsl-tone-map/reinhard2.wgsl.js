export default /* wgsl */ `fn reinhard2(x: vec3f) -> vec3f {
  const L_white: f32 = 4.0;

  return (x * (1.0 + x / (L_white * L_white))) / (1.0 + x);
}

fn reinhard2Scalar(x: f32) -> f32 {
  const L_white: f32 = 4.0;

  return (x * (1.0 + x / (L_white * L_white))) / (1.0 + x);
}

`;

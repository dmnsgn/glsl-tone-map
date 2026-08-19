export default /* wgsl */ `fn reinhard(x: vec3f) -> vec3f {
  return x / (1.0 + x);
}

fn reinhardScalar(x: f32) -> f32 {
  return x / (1.0 + x);
}

`;

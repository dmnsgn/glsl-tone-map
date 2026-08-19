export default /* wgsl */ `// Unreal 3, Documentation: "Color Grading"
// Adapted to be close to Tonemap_ACES, with similar range
// Gamma 2.2 correction is baked in, don't use with sRGB conversion!
fn unreal(x: vec3f) -> vec3f {
  return x / (x + 0.155) * 1.019;
}

fn unrealScalar(x: f32) -> f32 {
  return x / (x + 0.155) * 1.019;
}

`;

// Hejl 2015, "ToneMapFilmic_Hejl2015"
// Purpose: This function applies a "film-like" tonemap to supplied
// HDR pixel. This curve does not approximate gamma2.2, so an explicit sRGB transform should be performed before display.
// Parameters:
//   vec3f hdr (IN) -- HDR pixel in linear space
//   f32 whitePt (IN) -- Scene white point. Must be > 0.0
// Returns: Tonemapped pixel, white point corrected, in gamma 1.0 space
// 08-18-15 v1 Jim Hejl
fn hejlCurve(hdr: vec3f, whitePt: f32) -> vec3f {
  let vh = vec4f(hdr, whitePt); // pack: [r,g,b,w]
  let va = (1.425 * vh) + 0.05; // eval filmic curve
  let vf = ((vh * va + 0.004) / ((vh * (va + 0.55) + 0.0491))) - 0.0821;
  // The curve is negative below ~0.0046 linear, so the documented whitePt > 0.0
  // is understated: at the root vf.w is 0 and the correction blows up, below it
  // the whole result flips sign. max() keeps black at black for the input side.
  return max(vec3f(0.0), vf.rgb / vf.www); // white point correction
}

fn hejl(hdr: vec3f) -> vec3f {
  const W: f32 = 11.2; // scene white point, as uncharted2
  return hejlCurve(hdr, W);
}


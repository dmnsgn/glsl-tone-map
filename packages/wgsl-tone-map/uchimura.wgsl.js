export default /* wgsl */ `// Uchimura 2017, "HDR theory and practice"
// Math: https://www.desmos.com/calculator/gslcdxvipg
// Source: https://www.slideshare.net/nikuque/hdr-theory-and-practicce-jp
fn uchimuraCurve(x: vec3f, P: f32, a: f32, m: f32, l: f32, c: f32, b: f32) -> vec3f {
  let l0 = ((P - m) * l) / a;
  let S0 = m + l0;
  let S1 = m + a * l0;
  let C2 = (a * P) / (P - S1);
  let CP = -C2 / P;

  let w0 = 1.0 - smoothstep(vec3f(0.0), vec3f(m), x);
  let w2 = step(vec3f(m + l0), x);
  let w1 = 1.0 - w0 - w2;

  let T = m * pow(x / m, vec3f(c)) + b;
  let S = P - (P - S1) * exp(CP * (x - S0));
  let L = m + a * (x - m);

  return T * w0 + L * w1 + S * w2;
}

fn uchimura(x: vec3f) -> vec3f {
  const P: f32 = 1.0;  // max display brightness
  const a: f32 = 1.0;  // contrast
  const m: f32 = 0.22; // linear section start
  const l: f32 = 0.4;  // linear section length
  const c: f32 = 1.33; // black
  const b: f32 = 0.0;  // pedestal

  return uchimuraCurve(x, P, a, m, l, c, b);
}

fn uchimuraCurveScalar(x: f32, P: f32, a: f32, m: f32, l: f32, c: f32, b: f32) -> f32 {
  let l0 = ((P - m) * l) / a;
  let S0 = m + l0;
  let S1 = m + a * l0;
  let C2 = (a * P) / (P - S1);
  let CP = -C2 / P;

  let w0 = 1.0 - smoothstep(0.0, m, x);
  let w2 = step(m + l0, x);
  let w1 = 1.0 - w0 - w2;

  let T = m * pow(x / m, c) + b;
  let S = P - (P - S1) * exp(CP * (x - S0));
  let L = m + a * (x - m);

  return T * w0 + L * w1 + S * w2;
}

fn uchimuraScalar(x: f32) -> f32 {
  const P: f32 = 1.0;  // max display brightness
  const a: f32 = 1.0;  // contrast
  const m: f32 = 0.22; // linear section start
  const l: f32 = 0.4;  // linear section length
  const c: f32 = 1.33; // black
  const b: f32 = 0.0;  // pedestal

  return uchimuraCurveScalar(x, P, a, m, l, c, b);
}

`;

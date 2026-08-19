# wgsl-tone-map

[![npm version](https://img.shields.io/npm/v/wgsl-tone-map)](https://www.npmjs.com/package/wgsl-tone-map)
[![stability-stable](https://img.shields.io/badge/stability-stable-brightgreen.svg)](https://www.npmjs.com/package/wgsl-tone-map)
[![npm minzipped size](https://img.shields.io/bundlephobia/minzip/wgsl-tone-map)](https://bundlephobia.com/package/wgsl-tone-map)
[![dependencies](https://img.shields.io/librariesio/release/npm/wgsl-tone-map)](https://github.com/dmnsgn/shaders-tone-map/blob/main/packages/wgsl-tone-map/package.json)
[![types](https://img.shields.io/npm/types/wgsl-tone-map)](https://github.com/microsoft/TypeScript)
[![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-fa6673.svg)](https://conventionalcommits.org)
[![styled with prettier](https://img.shields.io/badge/styled_with-Prettier-f8bc45.svg?logo=prettier)](https://github.com/prettier/prettier)
[![linted with eslint](https://img.shields.io/badge/linted_with-ES_Lint-4B32C3.svg?logo=eslint)](https://github.com/eslint/eslint)
[![license](https://img.shields.io/github/license/dmnsgn/shaders-tone-map)](https://github.com/dmnsgn/shaders-tone-map/blob/main/LICENSE.md)

A collection of tone mapping functions available both as ES modules strings and as WGSL files. Mostly taken from [here](https://bruop.github.io/tonemapping/) and [here](https://www.shadertoy.com/view/WdjSW3).

Looking for WebGL? See [glsl-tone-map](https://github.com/dmnsgn/shaders-tone-map/tree/main/packages/glsl-tone-map), which ships the same operators in GLSL.

![Response curves for the eleven tone mapping operators, linear input against linear output](https://raw.githubusercontent.com/dmnsgn/shaders-tone-map/main/screenshot.svg)

[![paypal](https://img.shields.io/badge/donate-paypal-informational?logo=paypal)](https://paypal.me/dmnsgn)
[![coinbase](https://img.shields.io/badge/donate-coinbase-informational?logo=coinbase)](https://commerce.coinbase.com/checkout/56cbdf28-e323-48d8-9c98-7019e72c97f3)
[![twitter](https://img.shields.io/twitter/follow/dmnsgn?style=social)](https://twitter.com/dmnsgn)

## Installation

```bash
npm install wgsl-tone-map
```

## Usage

WGSL has no function overloading, so the `f32` variants are suffixed with `Scalar` (eg. `acesScalar`) and the parameterised curves are named `hejlCurve`, `uchimuraCurve` and `uncharted2Curve`.

### ESM

```js
import * as wgslToneMap from "wgsl-tone-map";

const shader = /* wgsl */ `
${wgslToneMap.AGX}
${wgslToneMap.NEUTRAL}
${wgslToneMap.ACES}
${wgslToneMap.FILMIC}
${wgslToneMap.HEJL}
${wgslToneMap.LOTTES}
${wgslToneMap.REINHARD}
${wgslToneMap.REINHARD2}
${wgslToneMap.UCHIMURA}
${wgslToneMap.UNCHARTED2}
${wgslToneMap.UNREAL}

@fragment
fn main() -> @location(0) vec4f {
  // ...
  color = vec4f(agx(color.rgb), color.a);
  color = vec4f(neutral(color.rgb), color.a);
  color = vec4f(aces(color.rgb), color.a);
  color = vec4f(filmic(color.rgb), color.a);
  color = vec4f(hejl(color.rgb), color.a);
  color = vec4f(lottes(color.rgb), color.a);
  color = vec4f(reinhard(color.rgb), color.a);
  color = vec4f(reinhard2(color.rgb), color.a);
  color = vec4f(uchimura(color.rgb), color.a);
  color = vec4f(uncharted2(color.rgb), color.a);
  color = vec4f(unreal(color.rgb), color.a);
  return color;
}`;
```

Each operator also ships as a plain `.wgsl` file (eg. `wgsl-tone-map/aces.wgsl`) for bundlers that load shaders as raw text.

## License

MIT. See [license file](https://github.com/dmnsgn/shaders-tone-map/blob/main/LICENSE.md).

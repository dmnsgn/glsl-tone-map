# shaders-tone-map

[![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-fa6673.svg)](https://conventionalcommits.org)
[![styled with prettier](https://img.shields.io/badge/styled_with-Prettier-f8bc45.svg?logo=prettier)](https://github.com/prettier/prettier)
[![linted with eslint](https://img.shields.io/badge/linted_with-ES_Lint-4B32C3.svg?logo=eslint)](https://github.com/eslint/eslint)
[![license](https://img.shields.io/github/license/dmnsgn/shaders-tone-map)](https://github.com/dmnsgn/shaders-tone-map/blob/main/LICENSE.md)

Eleven tone mapping operators for GLSL and WGSL, as ES module strings and as plain shader files. The two ports are one to one, so both languages give you the same curves.

![Response curves for the eleven tone mapping operators, linear input against linear output](https://raw.githubusercontent.com/dmnsgn/shaders-tone-map/main/screenshot.svg)

## Packages

| Package                                                                                                                                       | Install               | For            |
| --------------------------------------------------------------------------------------------------------------------------------------------- | --------------------- | -------------- |
| [**glsl-tone-map**](packages/glsl-tone-map) [![npm](https://img.shields.io/npm/v/glsl-tone-map)](https://www.npmjs.com/package/glsl-tone-map) | `npm i glsl-tone-map` | WebGL, glslify |
| [**wgsl-tone-map**](packages/wgsl-tone-map) [![npm](https://img.shields.io/npm/v/wgsl-tone-map)](https://www.npmjs.com/package/wgsl-tone-map) | `npm i wgsl-tone-map` | WebGPU         |

## Usage

Every operator is a string you interpolate into your shader:

```js
import { AGX } from "glsl-tone-map";

const fragmentShader = /* glsl */ `
${AGX}

void main() {
  gl_FragColor = vec4(agx(color.rgb), 1.0);
}`;
```

Each one also ships as a plain file — `glsl-tone-map/agx.glsl` for glslify or a raw-text bundler import, `wgsl-tone-map/agx.wgsl` likewise.

## Operators

| Operator                | Reference                                                                                                                                                                                                                                                                                                          |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `aces`                  | Narkowicz 2015, "ACES Filmic Tone Mapping Curve"                                                                                                                                                                                                                                                                   |
| `agx`                   | [Missing Deadlines](https://iolite-engine.com/blog_posts/minimal_agx_implementation), [Filament](https://github.com/google/filament/blob/main/filament/src/ToneMapper.cpp#L263) and [AgX_LUT_Gen](https://github.com/EaryChow/AgX_LUT_Gen/blob/main/AgXBaseRec2020.py). Also `agxGolden`, `agxPunchy`, `agxNeedle` |
| `filmic`                | Hejl and Burgess-Dawson, via [Filmic Tonemapping Operators](http://filmicworlds.com/blog/filmic-tonemapping-operators/)                                                                                                                                                                                            |
| `hejl`                  | Jim Hejl 2015, `ToneMapFilmic_Hejl2015`                                                                                                                                                                                                                                                                            |
| `lottes`                | Lottes 2016, "Advanced Techniques and Optimization of HDR Color Pipelines"                                                                                                                                                                                                                                         |
| `neutral`               | [Khronos PBR Neutral Tone Mapper](https://github.com/KhronosGroup/ToneMapping/tree/main/PBR_Neutral)                                                                                                                                                                                                               |
| `reinhard`, `reinhard2` | Reinhard et al. 2002, the second with a white point                                                                                                                                                                                                                                                                |
| `uchimura`              | Uchimura 2017, ["HDR theory and practice"](https://www.slideshare.net/nikuque/hdr-theory-and-practicce-jp) ([curve](https://www.desmos.com/calculator/gslcdxvipg))                                                                                                                                                 |
| `uncharted2`            | Hable, Uncharted 2                                                                                                                                                                                                                                                                                                 |
| `unreal`                | Unreal 3 documentation, "Color Grading"                                                                                                                                                                                                                                                                            |

Collected from [this comparison of tone mapping operators](https://bruop.github.io/tonemapping/) and [this Shadertoy](https://www.shadertoy.com/view/WdjSW3).

## Notes

**Color space.** Every operator takes and returns linear color, with one exception: `unreal` has gamma 2.2 baked in, so don't apply an sRGB transform after it.

**Range.** `aces`, `filmic`, `neutral`, `reinhard` and `uchimura` stay within `[0, 1]`. `hejl`, `lottes`, `reinhard2`, `uncharted2` and `unreal` can exceed `1.0` above their white point — clamp if your target needs it.

**WGSL.** It has no function overloading, so the `f32` variants are suffixed with `Scalar` (`acesScalar`) and the parameterised curves are named `hejlCurve`, `uchimuraCurve` and `uncharted2Curve`. Everything else matches the GLSL sources.

## License

MIT. See [license file](LICENSE.md).

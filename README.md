# glsl-tone-map

[![npm version](https://img.shields.io/npm/v/glsl-tone-map)](https://www.npmjs.com/package/glsl-tone-map)
[![stability-stable](https://img.shields.io/badge/stability-frozen-brightgreen.svg)](https://www.npmjs.com/package/glsl-tone-map)
[![npm minzipped size](https://img.shields.io/bundlephobia/minzip/glsl-tone-map)](https://bundlephobia.com/package/glsl-tone-map)
[![dependencies](https://img.shields.io/librariesio/release/npm/glsl-tone-map)](https://github.com/dmnsgn/glsl-tone-map/blob/main/package.json)
[![types](https://img.shields.io/npm/types/glsl-tone-map)](https://github.com/microsoft/TypeScript)
[![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-fa6673.svg)](https://conventionalcommits.org)
[![styled with prettier](https://img.shields.io/badge/styled_with-Prettier-f8bc45.svg?logo=prettier)](https://github.com/prettier/prettier)
[![linted with eslint](https://img.shields.io/badge/linted_with-ES_Lint-4B32C3.svg?logo=eslint)](https://github.com/eslint/eslint)
[![license](https://img.shields.io/github/license/dmnsgn/glsl-tone-map)](https://github.com/dmnsgn/glsl-tone-map/blob/main/LICENSE.md)

A collection of tone mapping functions available both as ES modules strings and as GLSL files for use with glslify. Mostly taken from [here](https://bruop.github.io/tonemapping/) and [here](https://www.shadertoy.com/view/WdjSW3).

[![paypal](https://img.shields.io/badge/donate-paypal-informational?logo=paypal)](https://paypal.me/dmnsgn)
[![coinbase](https://img.shields.io/badge/donate-coinbase-informational?logo=coinbase)](https://commerce.coinbase.com/checkout/56cbdf28-e323-48d8-9c98-7019e72c97f3)
[![twitter](https://img.shields.io/twitter/follow/dmnsgn?style=social)](https://twitter.com/dmnsgn)

## Installation

```bash
npm install glsl-tone-map
```

## Usage

### ESM

```js
import * as glslToneMap from "./index.js";

const shader = /* glsl */ `
${glslToneMap.ACES}
${glslToneMap.FILMIC}
${glslToneMap.LOTTES}
${glslToneMap.REINHARD}
${glslToneMap.REINHARD2}
${glslToneMap.UCHIMURA}
${glslToneMap.UNCHARTED2}
${glslToneMap.UNREAL}

void main() {
  // ...
  color.rgb = aces(color.rgb);
  color.rgb = filmic(color.rgb);
  color.rgb = lottes(color.rgb);
  color.rgb = reinhard(color.rgb);
  color.rgb = reinhard2(color.rgb);
  color.rgb = uchimura(color.rgb);
  color.rgb = uncharted2(color.rgb);
  color.rgb = unreal(color.rgb);
}`;
```

### glslify

```glsl
#pragma glslify: aces = require(../aces)
#pragma glslify: filmic = require(../filmic)
#pragma glslify: lottes = require(../lottes)
#pragma glslify: reinhard = require(../reinhard)
#pragma glslify: reinhard2 = require(../reinhard2)
#pragma glslify: uchimura = require(../uchimura)
#pragma glslify: uncharted2 = require(../uncharted2)
#pragma glslify: unreal = require(../unreal)

void main() {
  // ...
  color.rgb = aces(color.rgb);
  color.rgb = filmic(color.rgb);
  color.rgb = lottes(color.rgb);
  color.rgb = reinhard(color.rgb);
  color.rgb = reinhard2(color.rgb);
  color.rgb = uchimura(color.rgb);
  color.rgb = uncharted2(color.rgb);
  color.rgb = unreal(color.rgb);
}
```

## License

MIT. See [license file](https://github.com/dmnsgn/glsl-tone-map/blob/main/LICENSE.md).

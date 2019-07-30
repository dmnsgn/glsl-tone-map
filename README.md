# glsl-tone-map [![frozen](http://badges.github.io/stability-badges/dist/frozen.svg)](http://github.com/badges/stability-badges)

A collection of tone mapping GLSL functions, available as modules for glslify. Mostly taken from [here](https://bruop.github.io/tonemapping/) and [here](https://www.shadertoy.com/view/WdjSW3).

## Installation

```bash
npm install glsl-tone-map
```

[![NPM](https://nodei.co/npm/glsl-tone-map.png)](https://nodei.co/npm/glsl-tone-map/)

## Usage

```glsl
#pragma glslify: aces = require(glsl-tone-map/aces)
#pragma glslify: uncharted2 = require(glsl-tone-map/uncharted2)
#pragma glslify: lottes = require(glsl-tone-map/lottes)
#pragma glslify: reinhard = require(glsl-tone-map/reinhard)
#pragma glslify: reinhard2 = require(glsl-tone-map/reinhard2)
#pragma glslify: uchimura = require(glsl-tone-map/uchimura)
#pragma glslify: filmic = require(glsl-tone-map/filmic)
#pragma glslify: unreal = require(glsl-tone-map/unreal)

void main() {
	// ...
	color.rgb = aces(color.rgb);
	color.rgb = uncharted2(color.rgb);
	color.rgb = lottes(color.rgb);
	color.rgb = reinhard(color.rgb);
	color.rgb = reinhard2(color.rgb);
	color.rgb = uchimura(color.rgb);
	color.rgb = filmic(color.rgb);
	color.rgb = unreal(color.rgb);
}
```

## License

MIT. See [license file](https://github.com/dmnsgn/glsl-tone-map/blob/master/LICENSE.md).

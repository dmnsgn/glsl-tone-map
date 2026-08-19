#pragma glslify: agx = require(../packages/glsl-tone-map/agx)
#pragma glslify: neutral = require(../packages/glsl-tone-map/neutral)
#pragma glslify: aces = require(../packages/glsl-tone-map/aces)
#pragma glslify: filmic = require(../packages/glsl-tone-map/filmic)
#pragma glslify: hejl = require(../packages/glsl-tone-map/hejl)
#pragma glslify: lottes = require(../packages/glsl-tone-map/lottes)
#pragma glslify: reinhard = require(../packages/glsl-tone-map/reinhard)
#pragma glslify: reinhard2 = require(../packages/glsl-tone-map/reinhard2)
#pragma glslify: uchimura = require(../packages/glsl-tone-map/uchimura)
#pragma glslify: uncharted2 = require(../packages/glsl-tone-map/uncharted2)
#pragma glslify: unreal = require(../packages/glsl-tone-map/unreal)

void main() {
  // ...
  color.rgb = agx(color.rgb);
  color.rgb = neutral(color.rgb);
  color.rgb = aces(color.rgb);
  color.rgb = filmic(color.rgb);
  color.rgb = hejl(color.rgb);
  color.rgb = lottes(color.rgb);
  color.rgb = reinhard(color.rgb);
  color.rgb = reinhard2(color.rgb);
  color.rgb = uchimura(color.rgb);
  color.rgb = uncharted2(color.rgb);
  color.rgb = unreal(color.rgb);
}

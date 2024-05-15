#pragma glslify: agx = require(../agx)
#pragma glslify: neutral = require(../neutral)
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
  color.rgb = agx(color.rgb);
  color.rgb = neutral(color.rgb);
  color.rgb = aces(color.rgb);
  color.rgb = filmic(color.rgb);
  color.rgb = lottes(color.rgb);
  color.rgb = reinhard(color.rgb);
  color.rgb = reinhard2(color.rgb);
  color.rgb = uchimura(color.rgb);
  color.rgb = uncharted2(color.rgb);
  color.rgb = unreal(color.rgb);
}

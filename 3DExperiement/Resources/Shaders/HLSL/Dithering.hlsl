#include "Uniforms.hlsl"
#include "Samplers.hlsl"
#include "Transform.hlsl"
#include "ScreenPos.hlsl"

const static float RGBSize = 16.0;
const static float ResDivisor = 6.0;

float quantize(float inp, float period) {
    return floor((inp + period / 2.) / period) * period;
}

float2 quantize(float2 inp, float2 period) {
    return floor((inp + period / 2.) / period) * period;
}

float bayer4x4(float2 uvScreenSpace) {
	float2 bayerCoord = floor(uvScreenSpace / ResDivisor);
    bayerCoord = fmod(bayerCoord, 4.0);
    
    const float4x4 bayerMat = float4x4(
    float4(1,9,3,11),
    float4(13,5,15,7),
    float4(4,12,2,10),
    float4(16,8,14,6)) / 16.0;
    
    int bayerIndex = int(bayerCoord.x + bayerCoord.y * 4.0);
    if (bayerIndex == 0) return bayerMat[0][0];
    if (bayerIndex == 1) return bayerMat[0][1];
    if (bayerIndex == 2) return bayerMat[0][2];
    if (bayerIndex == 3) return bayerMat[0][3];
    if (bayerIndex == 4) return bayerMat[1][0];
    if (bayerIndex == 5) return bayerMat[1][1];
    if (bayerIndex == 6) return bayerMat[1][2];
    if (bayerIndex == 7) return bayerMat[1][3];
    if (bayerIndex == 8) return bayerMat[2][0];
    if (bayerIndex == 9) return bayerMat[2][1];
    if (bayerIndex == 10) return bayerMat[2][2];
    if (bayerIndex == 11) return bayerMat[2][3];
    if (bayerIndex == 12) return bayerMat[3][0];
    if (bayerIndex == 13) return bayerMat[3][1];
    if (bayerIndex == 14) return bayerMat[3][2];
    if (bayerIndex == 15) return bayerMat[3][3];

    return 0.0;
}

void VS(float4 iPos : POSITION, out float2 oScreenPos : TEXCOORD0, out float4 oPos : OUTPOSITION) {
    float4x3 modelMatrix = iModelMatrix;
    float3 worldPos = GetWorldPos(modelMatrix);
    oPos = GetClipPos(worldPos);
    oScreenPos = GetScreenPosPreDiv(oPos);
}

void PS(float2 iScreenPos : TEXCOORD0, out float4 oColor : OUTCOLOR0) {
    float2 resolution = 1.0 / cGBufferInvSize;
    
    float2 fragCoord = iScreenPos * resolution;

    float3 quantizationPeriod = float3(1.0 / (RGBSize - 1.0), 1.0 / (RGBSize - 1.0), 1.0 / (RGBSize - 1.0));
    
	float2 uvPixellated = floor(fragCoord / ResDivisor) * ResDivisor;
    
    float3 dc = Sample2D(DiffMap, uvPixellated / resolution).rgb;
    
    dc += (bayer4x4(fragCoord) - 0.5) * quantizationPeriod;
    
    dc = float3(quantize(dc.r, quantizationPeriod.r), quantize(dc.g, quantizationPeriod.g), quantize(dc.b, quantizationPeriod.b));

	oColor = float4(dc, 1);
}

/* eslint-disable */
// @ts-nocheck

import {If, Fn, uv, vec2, vec3, float, sin, cos, abs, smoothstep, time, length, min, max } from 'three/tsl';


const sdSegment = Fn(([p, a, b]) => {
  const pa = p.sub(a);
  const ba = b.sub(a);
  const h = min(float(1.0), max(float(0.0), pa.dot(ba).div(ba.dot(ba))));
  return length(pa.sub(ba.mul(h)));
});

const sdCircle = Fn(([p, r]) => {
  return length(p).sub(r);
});

const rotate = Fn(([p, angle])=>{
  const c = cos(angle);
  const s = sin(angle);
  return vec2(
    p.x.mul(c).sub(p.y.mul(s)),
    p.x.mul(s).add(p.y.mul(c))
  );
});


const getWavePattern = Fn(([uvNode, timeVar]) => {

    const wave1 = sin(uvNode.x.mul(2.5).add(timeVar.mul(0.6))).mul(0.12).add(0.5);
    const glow1 = float(0.003).div(abs(uvNode.y.sub(wave1))).mul(0.15);

    const wave2 = cos(uvNode.x.mul(4.5).sub(timeVar.mul(1.1))).mul(0.08).add(0.35);
    const glow2 = float(0.002).div(abs(uvNode.y.sub(wave2))).mul(0.12);

    const wave3 = sin(uvNode.x.mul(6.0).add(timeVar.mul(1.4))).mul(0.05).add(0.65);
    const glow3 = float(0.0015).div(abs(uvNode.y.sub(wave3))).mul(0.1);

    const wave4 = cos(uvNode.x.mul(1.5).add(timeVar.mul(0.2))).mul(0.15).add(0.45);
    const glow4 = float(0.004).div(abs(uvNode.y.sub(wave4))).mul(0.08);

    return glow1.add(glow2).add(glow3).add(glow4);
});


const getCrossPattern = Fn(([uvNode]) => {
    const p = uvNode.sub(0.5); 
    const d1 = sdSegment(p, vec2(-0.3, -0.3), vec2(0.3, 0.3));
    const d2 = sdSegment(p, vec2(-0.3, 0.3), vec2(0.3, -0.3));
    const d = min(d1, d2);
    return float(0.012).div(d).mul(0.3); 
});


const getCheckPattern = Fn(([uvNode]) => {
    const p = uvNode.sub(0.5);
    const d1 = sdSegment(p, vec2(-0.2, 0.0), vec2(-0.05, -0.15));
    const d2 = sdSegment(p, vec2(-0.05, -0.15), vec2(0.3, 0.3));
    const d = min(d1, d2);
    return float(0.008).div(d).mul(0.2);
});


const getTunnelPattern = Fn(([uvNode, timeVar]) => {
    const p = uvNode.sub(0.5);
    const rotatedP = rotate(p, timeVar.mul(2.0));

    const radius = sin(timeVar.mul(3.0)).mul(0.1).add(0.25);
    const d = abs(sdCircle(rotatedP, radius));

    const angle = rotatedP.y.atan2(rotatedP.x);
    const dash = sin(angle.mul(8.0).add(timeVar.mul(5.0))).add(1.0);
    
    return float(0.008).div(d).mul(0.2).mul(dash);
});

const createBGShader = (uMouse, uStatus) => {
  return Fn(() => {
    const uvNode = uv();
    const timeVar = time.mul(0.5);
    
    const finalIntensity = float(0.0).toVar();
    const finalColor = vec3(0.0).toVar();

    const colIdle = vec3(0.3, 0.4, 1.0);     // Blue
    const colLoading = vec3(0.6, 0.2, 1.0);  // peple
    const colSuccess = vec3(0.2, 1.0, 0.5);  // green
    const colError = vec3(1.0, 0.1, 0.2);    // red


    const patWave = getWavePattern(uvNode, timeVar);
    const patLoading = getTunnelPattern(uvNode, timeVar);
    const patSuccess = getCheckPattern(uvNode);
    const patCross = getCrossPattern(uvNode);


    If(uStatus.equal(0), () => {
        finalIntensity.assign(patWave);
        finalColor.assign(colIdle);
    }).ElseIf(uStatus.equal(1), () => {
        finalIntensity.assign(patLoading);
        finalColor.assign(colLoading);
    }).ElseIf(uStatus.equal(2), () => {
        finalIntensity.assign(patSuccess);
        finalColor.assign(colSuccess);
    }).ElseIf(uStatus.equal(3), () => {
        finalIntensity.assign(patCross);
        finalColor.assign(colError);
    });

    return finalColor.mul(finalIntensity);
  })();
};

export default createBGShader;

/* eslint-disable */
// @ts-nocheck
import { Fn, uv, vec2, vec3, float, sin, cos, abs, time, length, min, max, mix, smoothstep } from 'three/tsl';

// --- توابع کمکی هندسی (SDF) ---
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

// --- الگوها (این بار فاصله برمی‌گردانند) ---

// 1. فاصله تا خطوط موج‌دار (Idle)
const getWaveDist = Fn(([uvNode, timeVar]) => {
    // فاصله تا موج ۱
    const y1 = sin(uvNode.x.mul(2.5).add(timeVar.mul(0.6))).mul(0.12).add(0.5);
    const d1 = abs(uvNode.y.sub(y1));

    // فاصله تا موج ۲
    const y2 = cos(uvNode.x.mul(4.5).sub(timeVar.mul(1.1))).mul(0.08).add(0.35);
    const d2 = abs(uvNode.y.sub(y2));

    // فاصله تا موج ۳
    const y3 = sin(uvNode.x.mul(6.0).add(timeVar.mul(1.4))).mul(0.05).add(0.65);
    const d3 = abs(uvNode.y.sub(y3));

    // فاصله تا موج ۴
    const y4 = cos(uvNode.x.mul(1.5).add(timeVar.mul(0.2))).mul(0.15).add(0.45);
    const d4 = abs(uvNode.y.sub(y4));

    // برگرداندن "کمترین" فاصله (یعنی نزدیک‌ترین خط)
    return min(d1, min(d2, min(d3, d4)));
});

// 2. فاصله تا ضربدر (Error)
const getCrossDist = Fn(([uvNode]) => {
    const p = uvNode.sub(0.5); 
    const d1 = sdSegment(p, vec2(-0.3, -0.3), vec2(0.3, 0.3));
    const d2 = sdSegment(p, vec2(-0.3, 0.3), vec2(0.3, -0.3));
    return min(d1, d2);
});

// 3. فاصله تا تیک (Success)
const getCheckDist = Fn(([uvNode]) => {
    const p = uvNode.sub(0.5);
    // کمی جابجایی تا تیک وسط بیفتد
    const d1 = sdSegment(p, vec2(-0.2, 0.0), vec2(-0.05, -0.15));
    const d2 = sdSegment(p, vec2(-0.05, -0.15), vec2(0.3, 0.3));
    return min(d1, d2);
});

// 4. فاصله تا دایره‌های تونل (Loading)
const getTunnelDist = Fn(([uvNode, timeVar]) => {
    const p = uvNode.sub(0.5);
    const rotatedP = rotate(p, timeVar.mul(2.0));
    
    // دایره اصلی
    const r1 = sin(timeVar.mul(3.0)).mul(0.1).add(0.25);
    const d1 = abs(sdCircle(rotatedP, r1));
    
    // یک دایره بزرگتر برای افکت بیشتر
    const d2 = abs(sdCircle(rotatedP, float(0.4)));

    return min(d1, d2);
});


// --- تابع اصلی ساخت شیدر ---
 const createBGShader = (uMouse, uAlphaIdle, uAlphaTunnel, uAlphaSuccess, uAlphaError) => {
  return Fn(() => {
    const uvNode = uv();
    const timeVar = time.mul(0.5);

    // محاسبه فاصله‌های خام برای هر ۴ حالت
    const dWave = getWaveDist(uvNode, timeVar);
    const dTunnel = getTunnelDist(uvNode, timeVar);
    const dCheck = getCheckDist(uvNode);
    const dCross = getCrossDist(uvNode);

    // --- MORPHING LOGIC ---
    // ایده: میانگین وزنی فاصله‌ها
    // وقتی uAlphaError زیاد می‌شود، شکل خطوط خم می‌شود تا شبیه ضربدر شود
    
    const totalAlpha = uAlphaIdle.add(uAlphaTunnel).add(uAlphaSuccess).add(uAlphaError);
    // جلوگیری از تقسیم بر صفر (یک مقدار خیلی کوچک اضافه می‌کنیم)
    const safeTotal = max(totalAlpha, 0.001);

    const weightedDist = float(0.0).toVar();
    weightedDist.addAssign(dWave.mul(uAlphaIdle));
    weightedDist.addAssign(dTunnel.mul(uAlphaTunnel));
    weightedDist.addAssign(dCheck.mul(uAlphaSuccess));
    weightedDist.addAssign(dCross.mul(uAlphaError));
    
    const finalDist = weightedDist.div(safeTotal);


    // --- COLOR BLENDING ---
    const colIdle = vec3(0.3, 0.4, 1.0);     // Blue
    const colLoading = vec3(0.6, 0.2, 1.0);  // Purple
    const colSuccess = vec3(0.2, 1.0, 0.5);  // Green
    const colError = vec3(1.0, 0.1, 0.2);    // Red

    const weightedColor = vec3(0.0).toVar();
    weightedColor.addAssign(colIdle.mul(uAlphaIdle));
    weightedColor.addAssign(colLoading.mul(uAlphaTunnel));
    weightedColor.addAssign(colSuccess.mul(uAlphaSuccess));
    weightedColor.addAssign(colError.mul(uAlphaError));

    const finalColor = weightedColor.div(safeTotal);

    // --- GLOW CALCULATION ---
    // حالا که شکل نهایی (finalDist) را داریم، به آن نور می‌دهیم
    // هرچه فاصله کمتر (نزدیک‌تر به خط)، نور بیشتر
    
    // ضخامت خطوط
    const thickness = float(0.003); 
    const glow = thickness.div(abs(finalDist)).mul(0.5);
    
    // کمی افکت درخشش اضافی برای تونل (اختیاری)
    // اینجا از پترن دش برای تونل استفاده نمیکنیم تا مورف تمیز بماند
    // اما می‌توان شدت نور را با زمان تغییر داد
    
    return finalColor.mul(glow);
  })();
};

export default createBGShader;
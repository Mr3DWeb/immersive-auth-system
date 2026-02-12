/* eslint-disable */
// @ts-nocheck
import { Fn, uv, vec2, vec3, float, sin, cos, abs, time, length, min, max, mix, smoothstep, distance, normalize } from 'three/tsl';

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

// --- افکت چاقو و اعوجاج (جدید) ---
// این تابع مختصات UV را می‌گیرد و اگر به ماوس نزدیک باشد، آن را "هل" می‌دهد
const distortUV = Fn(([uvNode, mousePos]) => {
    const dist = distance(uvNode, mousePos);
    
    // شعاع اثرگذاری (مثلا 0.25 از صفحه)
    const radius = float(0.25);
    
    // قدرت هل دادن (هرچه عدد بزرگتر، خطوط بیشتر پرت می‌شوند)
    const strength = float(0.15); 
    
    // محاسبه نیرو: در مرکز 1 است و در لبه شعاع 0 می‌شود
    const force = smoothstep(radius, float(0.0), dist);
    
    // جهت از ماوس به سمت پیکسل فعلی
    const dir = normalize(uvNode.sub(mousePos));
    
    // نکته مهم: برای اینکه خطوط "دور" شوند، باید UV را "به سمت" ماوس بکشیم
    // (چون ما داریم محل سمپل کردن را تغییر می‌دهیم)
    return uvNode.sub(dir.mul(force).mul(strength));
});


// --- الگوها (بر اساس UV تغییر یافته) ---

const getWaveDist = Fn(([uvNode, timeVar]) => {
    // موج‌ها با کمی تغییر پارامتر برای زیبایی بیشتر
    const y1 = sin(uvNode.x.mul(2.5).add(timeVar.mul(0.6))).mul(0.12).add(0.5);
    const d1 = abs(uvNode.y.sub(y1));

    const y2 = cos(uvNode.x.mul(4.5).sub(timeVar.mul(1.1))).mul(0.08).add(0.35);
    const d2 = abs(uvNode.y.sub(y2));

    const y3 = sin(uvNode.x.mul(6.0).add(timeVar.mul(1.4))).mul(0.05).add(0.65);
    const d3 = abs(uvNode.y.sub(y3));

    const y4 = cos(uvNode.x.mul(1.5).add(timeVar.mul(0.2))).mul(0.15).add(0.45);
    const d4 = abs(uvNode.y.sub(y4));

    return min(d1, min(d2, min(d3, d4)));
});

const getCrossDist = Fn(([uvNode]) => {
    const p = uvNode.sub(0.5); 
    const d1 = sdSegment(p, vec2(-0.3, -0.3), vec2(0.3, 0.3));
    const d2 = sdSegment(p, vec2(-0.3, 0.3), vec2(0.3, -0.3));
    return min(d1, d2);
});

const getCheckDist = Fn(([uvNode]) => {
    const p = uvNode.sub(0.5);
    const d1 = sdSegment(p, vec2(-0.2, 0.0), vec2(-0.05, -0.15));
    const d2 = sdSegment(p, vec2(-0.05, -0.15), vec2(0.3, 0.3));
    return min(d1, d2);
});

const getTunnelDist = Fn(([uvNode, timeVar]) => {
    const p = uvNode.sub(0.5);
    const rotatedP = rotate(p, timeVar.mul(2.0));
    const r1 = sin(timeVar.mul(3.0)).mul(0.1).add(0.25);
    const d1 = abs(sdCircle(rotatedP, r1));
    const d2 = abs(sdCircle(rotatedP, float(0.4)));
    return min(d1, d2);
});


const createBGShader = (uMouse, uAlphaIdle, uAlphaTunnel, uAlphaSuccess, uAlphaError) => {
  return Fn(() => {
    const rawUV = uv(); // UV اصلی
    const timeVar = time.mul(0.5);

    // 1. اعمال اعوجاج ماوس روی UV
    // این باعث می‌شود تمام شکل‌های بعدی (موج، تونل و...) تحت تاثیر این خمیدگی قرار بگیرند
    const distortedUVNode = distortUV(rawUV, uMouse);

    // 2. محاسبه فاصله‌ها با UV خمیده شده
    const dWave = getWaveDist(distortedUVNode, timeVar);
    const dTunnel = getTunnelDist(distortedUVNode, timeVar); // تونل هم واکنش نشان می‌دهد
    const dCheck = getCheckDist(distortedUVNode);
    const dCross = getCrossDist(distortedUVNode);

    // --- MORPHING LOGIC ---
    const totalAlpha = uAlphaIdle.add(uAlphaTunnel).add(uAlphaSuccess).add(uAlphaError);
    const safeTotal = max(totalAlpha, 0.001);

    const weightedDist = float(0.0).toVar();
    weightedDist.addAssign(dWave.mul(uAlphaIdle));
    weightedDist.addAssign(dTunnel.mul(uAlphaTunnel));
    weightedDist.addAssign(dCheck.mul(uAlphaSuccess));
    weightedDist.addAssign(dCross.mul(uAlphaError));
    
    const finalDist = weightedDist.div(safeTotal);

    // --- COLOR BLENDING ---
    const colIdle = vec3(0.3, 0.4, 1.0);     
    const colLoading = vec3(0.6, 0.2, 1.0);  
    const colSuccess = vec3(0.2, 1.0, 0.5);  
    const colError = vec3(1.0, 0.1, 0.2);    

    const weightedColor = vec3(0.0).toVar();
    weightedColor.addAssign(colIdle.mul(uAlphaIdle));
    weightedColor.addAssign(colLoading.mul(uAlphaTunnel));
    weightedColor.addAssign(colSuccess.mul(uAlphaSuccess));
    weightedColor.addAssign(colError.mul(uAlphaError));

    const baseColor = weightedColor.div(safeTotal);

    // --- GLOW & TRAIL ---
    const thickness = float(0.003); 
    const shapeGlow = thickness.div(abs(finalDist)).mul(0.5);
    
    // محاسبه درخشش ماوس (رد آبی)
    // استفاده از UV اصلی برای موقعیت ماوس (تا درخشش خودش کج نشود)
    const mouseDist = distance(rawUV, uMouse);
    // هرچه نزدیکتر، روشن‌تر (مثل یک نقطه نورانی)
    const mouseGlowIntensity = float(0.015).div(abs(mouseDist).add(0.05)).mul(float(0.8));
    
    // رنگ ماوس (آبی الکتریکی)
    const mouseColor = vec3(0.2, 0.6, 1.0); 

    // ترکیب رنگ نهایی: (رنگ شکل * درخشش شکل) + (رنگ ماوس * درخشش ماوس)
    return baseColor.mul(shapeGlow).add(mouseColor.mul(mouseGlowIntensity));
  })();
};

export default createBGShader;
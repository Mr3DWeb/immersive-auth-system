import { color, distance, Fn, mix, sin, time, uniform, uv } from 'three/tsl';

type MouseType = ReturnType<typeof uniform>;

const createBGShader = (uMouse : MouseType)=>{
  return Fn(()=>{
    const uvNode = uv();
    const mousePos = uMouse.add(1).div(2);
    const distToMouse = distance(uvNode, mousePos);

    const wave = sin(distToMouse.mul(15).sub(time));

    const deepColor = color("#000000");
    const highColor = color("#4f46e5");

    const mixFactor = wave.add(1).div(2);

    const finalPattern = mixFactor.mul(uvNode.y.add(0.2));
    
    return mix(deepColor, highColor, finalPattern);

  })
}

export default createBGShader;
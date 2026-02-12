import { useMemo,useEffect } from "react";
import { extend } from "@react-three/fiber";
import { Vector2 } from "three";
import { MeshBasicNodeMaterial } from "three/webgpu";
import { uniform } from "three/tsl";
import createBGShader from "./Logic";
import useAuthStore from "../store/store";
import useResponsiveData from "../hooks/useResponsiveData";
import type { Mesh } from "three";
import gsap from 'gsap';

extend ({MeshBasicNodeMaterial});

declare module "@react-three/fiber" {
  interface ThreeElements {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    meshBasicNodeMaterial: any;
  }
}

interface BackgroundProps {
  setRef: (node: Mesh | null) => void;
}

function Background({setRef}:BackgroundProps){
  const responsiveData = useResponsiveData();

  const status = useAuthStore((state)=> state.status);

  const uMouse = useMemo(() => uniform(new Vector2(0, 0)), []);
  const uAlphaIdle = useMemo(() => uniform(1), []);
  const uAlphaTunnel = useMemo(() => uniform(0), []);
  const uAlphaSuccess = useMemo(() => uniform(0), []);
  const uAlphaError = useMemo(() => uniform(0), []);


  const shaderNode = useMemo(
    () => createBGShader(uMouse, uAlphaIdle, uAlphaTunnel, uAlphaSuccess, uAlphaError),
    [uMouse, uAlphaIdle, uAlphaTunnel, uAlphaSuccess, uAlphaError]
  );

  useEffect(() => {
    // تنظیم وضعیت هدف برای هر ۴ متغیر
    const targets = {
      idle: 0,
      tunnel: 0,
      success: 0,
      error: 0
    };

    switch (status) {
      case 'idle': targets.idle = 1; break;
      case 'tunnel': targets.tunnel = 1; break;
      case 'success': targets.success = 1; break;
      case 'error': targets.error = 1; break;
    }

    // نکته کلیدی برای Morphing تمیز:
    // ما از GSAP می‌خواهیم که مقادیر را تغییر دهد.
    // چون در شیدر از تقسیم بر مجموع وزن‌ها استفاده کردیم (Average)،
    // مهم نیست مجموع دقیقاً ۱ باشد، اما نباید همه همزمان ۰ شوند.
    
    const duration = 1.0; // سرعت تغییر شکل (۱ ثانیه)

    gsap.to(uAlphaIdle, { value: targets.idle, duration, ease: "power2.inOut" });
    gsap.to(uAlphaTunnel, { value: targets.tunnel, duration, ease: "power2.inOut" });
    gsap.to(uAlphaSuccess, { value: targets.success, duration, ease: "back.out(1.2)" }); // کمی حالت ارتجاعی
    gsap.to(uAlphaError, { value: targets.error, duration, ease: "elastic.out(1, 0.5)" }); // لرزش برای ارور

  }, [status, uAlphaIdle, uAlphaTunnel, uAlphaSuccess, uAlphaError]);


  return (
    <mesh ref={setRef}>
      <planeGeometry args={[responsiveData.planeArgs.x, responsiveData.planeArgs.y, 32, 32]} />
      <meshBasicNodeMaterial colorNode={shaderNode} side={2} />
    </mesh>
  )

}

export default Background;
import { useMemo, useEffect } from "react";
import { extend, useFrame } from "@react-three/fiber";
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
  const { planeArgs, isMobile } = useResponsiveData();

  const status = useAuthStore((state)=> state.status);
  const view = useAuthStore((state) => state.view);


  const uMouse = useMemo(() => uniform(new Vector2(10, 10)), []);
  const uAlphaIdle = useMemo(() => uniform(1), []);
  const uAlphaTunnel = useMemo(() => uniform(0), []);
  const uAlphaSuccess = useMemo(() => uniform(0), []);
  const uAlphaError = useMemo(() => uniform(0), []);


  const shaderNode = useMemo(
    () => createBGShader(uMouse, uAlphaIdle, uAlphaTunnel, uAlphaSuccess, uAlphaError),
    [uMouse, uAlphaIdle, uAlphaTunnel, uAlphaSuccess, uAlphaError]
  );

  useEffect(() => {
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

    const duration = 1.0; // change view speed

    gsap.to(uAlphaIdle, { value: targets.idle, duration, ease: "power2.inOut" });
    gsap.to(uAlphaTunnel, { value: targets.tunnel, duration, ease: "power2.inOut" });
    gsap.to(uAlphaSuccess, { value: targets.success, duration, ease: "back.out(1.2)" });
    gsap.to(uAlphaError, { value: targets.error, duration, ease: "elastic.out(1, 0.5)" });

  }, [status, uAlphaIdle, uAlphaTunnel, uAlphaSuccess, uAlphaError]);

  useFrame(({ pointer }) => {
    if (isMobile) {
      if (uMouse.value.x !== 10) uMouse.value.set(10, 10);
      return; 
    }

    let targetX = (pointer.x + 1) / 2;
    const targetY = (pointer.y + 1) / 2;

    if (view === 'signup' || view === 'dashboard' ) {
      targetX = 1 - targetX;
    }

    // Lerp
    const current = uMouse.value;
    
    const nextX = current.x + (targetX - current.x) * 0.1;
    const nextY = current.y + (targetY - current.y) * 0.1;
    
    current.set(nextX, nextY);
  });


  return (
    <mesh ref={setRef}>
      <planeGeometry args={[planeArgs.x, planeArgs.y, 32, 32]} />
      <meshBasicNodeMaterial colorNode={shaderNode} side={2} />
    </mesh>
  )

}

export default Background;
'use client';

import { Suspense, useCallback, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { WebGPURenderer } from "three/webgpu";
import { ACESFilmicToneMapping,SRGBColorSpace } from "three";
import { OrbitControls, Html } from "@react-three/drei";

import useResponsiveData from "./hooks/useResponsiveData";
import Background from "./background/Background";
import Login from "./ui/Login";
import SignUp from "./ui/SignUp";
import AnimationManager from "./animation/AnimationManager";

import type { Mesh } from "three";

function Scene(){
  const responsiveData = useResponsiveData();

  const blockerRef = useRef<Mesh>(null!);
  const [isBlockerReady, setIsBlockerReady] = useState(false);
  const setBlockerRef = useCallback((node: Mesh | null) => {
    if (node) {
      blockerRef.current = node;
      setIsBlockerReady(true);
    }
  }, []);

  return(
    <>
    <Suspense fallback={null}>
      <Canvas 
      gl={async(props)=>{
        // @ts-expect-error WebGPU renderer is experimental and not typed yet
        const renderer = new WebGPURenderer(props);
        renderer.outputColorSpace = SRGBColorSpace;
        renderer.toneMapping = ACESFilmicToneMapping;
        await renderer.init();
        return renderer
      }}
      camera={{ position: [0, 0, responsiveData.cameraZ], fov: 50}}
      >
        <OrbitControls />
      <Html occlude={isBlockerReady ? [blockerRef] : undefined} scale={0.1} transform center position={[0, 0, 0.05]} zIndexRange={[100, 0]}>
        <Login />
      </Html>

      <Html occlude={isBlockerReady ? [blockerRef] : undefined} transform scale={0.1} center position={[0, 0, -0.05]} rotation={[0, Math.PI, 0]} zIndexRange={[100, 0]}>
        <SignUp />
      </Html>

        <Background setRef={setBlockerRef} />

        <AnimationManager />
      </Canvas>
    </Suspense>

    


    </>
  )
}

export default Scene;
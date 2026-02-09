'use client';

import { Canvas } from "@react-three/fiber";
import { WebGPURenderer } from "three/webgpu";
import Scene from "./Scene";

import styles from './Experience.module.css';

function Experience(){
  return(
    <>
    <div className={styles.canvasWarpper}>
      <Canvas 
      gl={async(props)=>{
        const renderer = new WebGPURenderer(props);
        await renderer.init();
        return renderer
      }}
      >
        <Scene />
    </Canvas>
    </div>



    </>
  )
}

export default Experience;
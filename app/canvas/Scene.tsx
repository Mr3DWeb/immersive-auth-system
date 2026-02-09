'use client';

import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";

import styles from './Scene.module.css';


function Scene(){
  return(
    <div className={styles.canvasWarpper}>
      <Canvas>
      <OrbitControls />

      <ambientLight />
      <directionalLight position={[2,2,2]} />

      <mesh>
        <boxGeometry args={[1,1,1]} />
        <meshStandardMaterial color="orange" />
      </mesh>


    </Canvas>
    </div>
  )
}

export default Scene;
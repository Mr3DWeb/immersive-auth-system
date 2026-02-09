'use client';

import { OrbitControls } from "@react-three/drei";



function Scene(){
  return(
      <>
      <OrbitControls />

      <ambientLight />
      <directionalLight position={[2,2,2]} />

      <mesh>
        <boxGeometry args={[1,1,1]} />
        <meshStandardMaterial color="orange" />
      </mesh>
     </>
  )
}

export default Scene;
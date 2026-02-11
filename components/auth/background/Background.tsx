import { useMemo,useEffect } from "react";
import { useFrame, useThree, extend } from "@react-three/fiber";
import { Vector2, DoubleSide } from "three";
import { MeshBasicNodeMaterial } from "three/webgpu";
import { uniform } from "three/tsl";
import createBGShader from "./Logic";
import useAuthStore from "../store/store";

extend ({MeshBasicNodeMaterial });

declare module "@react-three/fiber" {
  interface ThreeElements {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    meshBasicNodeMaterial: any;
  }
}


function Background(){
  const {viewport} = useThree();
  const status = useAuthStore((state)=> state.status);

  const uMouse = useMemo (() => uniform(new Vector2(0,0)),[]);
  const uStatus = useMemo (()=> uniform(0) ,[]); //0: Idle, 1: tunnel, 2: Success, 3: Error


  const shaderNode = useMemo(()=> createBGShader(uMouse, uStatus) ,[uMouse, uStatus]);

 useEffect(() => {
    let statusValue = 0;
    switch (status) {
      case 'idle': 
        statusValue = 0; 
        break;
      case 'tunnel':
        statusValue = 1; 
        break;
      case 'success': 
        statusValue = 2; 
        break;
      case 'error': 
        statusValue = 3; 
        break;
      default:
        statusValue = 0;
    }
    
   // eslint-disable-next-line
    uStatus.value = statusValue;
    
    console.log(`Background Logic: Status changed to '${status}' -> Shader Value: ${statusValue}`);
  }, [status, uStatus]);

  // useFrame(({pointer})=>{
  //   uMouse.value.lerp(new Vector2(pointer.x,pointer.y),0.01);
  // })

  return (
    <mesh scale={[viewport.width,viewport.height,1]}>
      <planeGeometry args={[1, 1, 32, 32]} />
      <meshBasicNodeMaterial colorNode={shaderNode} side={DoubleSide} />
    </mesh>
  )

}

export default Background;
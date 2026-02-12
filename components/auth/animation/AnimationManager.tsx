import { useEffect,useRef } from "react";
import { useThree } from "@react-three/fiber";
import gsap from "gsap";
import useAuthStore from "../store/store";

function AnimationManager(){
  const {camera} = useThree();

  const view = useAuthStore((state) => state.view);
  const setStatus = useAuthStore((state) => state.setStatus);
  const setIsAnimating = useAuthStore((state) => state.setIsAnimating);

  const prevView = useRef(view);

  //---Animation Function----
  const animateToSignUp = () => {
    setIsAnimating(true);
    
    const tl = gsap.timeline({
      onComplete: () => {
        setIsAnimating(false);
        setStatus('idle');
      }
    });
    
    tl.to({}, { duration: 0.1, onStart: () => setStatus('tunnel') })
      .to(camera.position, {
        z: -3,
        duration: 2,
        ease: 'power2.inOut',
      }, 0)
      .to(camera.rotation, {
        y: Math.PI,
        duration: 2,
        ease: 'power2.inOut',
      }, 0)
  };

  const animateToLogin = () => {
    setIsAnimating(true);
    
    const tl = gsap.timeline({
      onComplete: () => {
        setIsAnimating(false);
        setStatus('idle');
      }
    });

    tl.to({}, { duration: 0.1, onStart: () => setStatus('tunnel') })
      .to(camera.position, {
        z: 3,
        duration: 2,
        ease: 'power2.inOut',
      }, 0)
      .to(camera.rotation, {
        y: 0,
        duration: 2,
        ease: 'power2.inOut',
      }, 0)
  };

  const animateToDashboard = () => {
    setIsAnimating(true);
    
    const tl = gsap.timeline({
      onComplete: () => {
        setIsAnimating(false);
        setStatus('idle');
      }
     });
     tl.to({}, { duration: 0.1, onStart: () => setStatus('tunnel') })
      .to(camera.position, {
        z: -3,
        duration: 2,
        ease: 'power2.inOut',
      }, 0)
      .to(camera.rotation, {
        y: Math.PI,
        duration: 2,
        ease: 'power2.inOut',
      }, 0)
  };

  //---useEffects
  useEffect(()=>{
   if (prevView.current === view) return;
    if (view === 'signup' && prevView.current === 'login') {
      animateToSignUp();
    } else if (view === 'login' && prevView.current === 'signup') {
      animateToLogin();
    } else if (view === 'dashboard') {
      animateToDashboard();
    }else if (view === 'login' && prevView.current === 'dashboard') {
      animateToLogin();
    }
    
    prevView.current = view;
  }, [view]);

  return null;
}

export default AnimationManager;
import { useEffect,useRef } from "react";
import { useThree } from "@react-three/fiber";
import gsap from "gsap";
import useAuthStore from "../store/store";

function AnimationManager(){
  const {camera} = useThree();

  const view = useAuthStore((state) => state.view);
  const setStatus = useAuthStore((state) => state.setStatus);
  const setIsAnimating = useAuthStore((state) => state.setIsAnimating);
  const setDashboardOpen = useAuthStore((state) => state.setDashboardOpen);

  const prevView = useRef(view);

  const DURATION_MOVE = 4;
  const DURATION_ROT = 0.1;
  const DELAY_ROT = (DURATION_MOVE - DURATION_ROT) / 2;

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
        duration: DURATION_MOVE,
        ease: 'power2.inOut',
      }, 0)
      .to(camera.rotation, {
        y: Math.PI,
        duration: DURATION_ROT,
        ease: 'power2.inOut',
      }, DELAY_ROT)
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
        duration: DURATION_MOVE,
        ease: 'power2.inOut',
      }, 0)
      .to(camera.rotation, {
        y: 0,
        duration: DURATION_ROT,
        ease: 'power2.inOut',
      }, DELAY_ROT)
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
        duration: DURATION_MOVE,
        ease: 'power2.inOut',
      }, 0)
      .to(camera.rotation, {
        y: Math.PI,
        duration: DURATION_ROT,
        ease: 'power2.inOut',
      }, DELAY_ROT)
  };

  const animateFromDashboardToLogin = () => {
    setIsAnimating(true);
    
    const tl = gsap.timeline({
      onComplete: () => {
        setIsAnimating(false);
        setStatus('idle');
        setDashboardOpen(false);
      }
    });

    tl.to({}, { duration: 0.1, onStart: () => setStatus('tunnel') })
      .to(camera.position, {
        z: 3,
        duration: DURATION_MOVE,
        ease: 'power2.inOut',
      }, 0)
      .to(camera.rotation, {
        y: 0,
        duration: DURATION_ROT,
        ease: 'power2.inOut',
      }, DELAY_ROT)
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
      animateFromDashboardToLogin();
    }
    
    prevView.current = view;
  }, [view]);

  return null;
}

export default AnimationManager;
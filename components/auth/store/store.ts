import { create } from "zustand";

export type AuthView = 'login' | 'signup' | 'dashboard';
export type ShaderStatus = 'idle' | 'tunnel' | 'success' | 'error';

interface AuthState {
  view:AuthView;
  status:ShaderStatus;
  isAnimating:boolean;


  setView:(view:AuthView) => void;
  setStatus: (status: ShaderStatus) => void;
  setIsAnimating:(state:boolean) => void;

  triggerError: () => void;
  triggerSuccess: () => void;
}

const useAuthStore = create<AuthState>((set, get)=>({
  view:'login',
  status:'idle',
  isAnimating: false,

  setView:(view)=>set({ view }),
  setStatus:(status)=>set({ status }),
  setIsAnimating: (isAnimating) => set({ isAnimating }),

  triggerError: () => {
    const { status } = get();
    if (status === 'error' || get().isAnimating) return;
    set({ status: 'error' });

    setTimeout(() => {
        set({ status: 'idle' });
    }, 2000);
  },

  triggerSuccess: () => {
   set({ status: 'success' });

   setTimeout(() => {
       set({ view: 'dashboard' });
       set({ status: 'idle' });
    }, 1500); 
  },

}))

export default useAuthStore;
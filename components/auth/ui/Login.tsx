import useAuthStore from "../store/store";
import React, { useState } from "react";
import  styles  from "./ui.module.css";

function Login(){

  const [loading , setLoading] = useState(false);

  const setView = useAuthStore((state) => state.setView);
  const triggerError = useAuthStore((state) => state.triggerError);
  const triggerSuccess = useAuthStore((state) => state.triggerSuccess);
  const isAnimating = useAuthStore((state) => state.isAnimating); 

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // --- Backend Integration Placeholder ---
    try {
      // const response = await fetch('/api/login', { body: ... });
      
      // شبیه‌سازی درخواست شبکه (Fake API)
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const isSuccess = Math.random() > 0.5; 

      if (isSuccess) {
        // اگر موفق بود:
        triggerSuccess(); // شیدر سبز می‌شود و بعد از کمی مکث میرود به داشبورد
      } else {
        // اگر ناموفق بود:
        triggerError();
      }

    } catch (error) {
      console.error(error);
      triggerError(); // شیدر قرمز می‌شود
    } finally {
      setLoading(false);
    }
  };

  const handleGoToSignUp = () => {
    if (loading || isAnimating) return;
    setView('signup');
  };

  return(
    <div className={styles.glassPanel} style={{opacity: isAnimating ? 0 : 1 }}>
    <div>
      <h1 className={styles.title}>Welcome</h1>
      <h2 className={styles.subtitle}> Practice Project Login System </h2>
    </div>
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }} >
      <div className={styles.inputGroup}>
          <input 
            type="text" 
            placeholder="Username" 
            className={styles.input} 
            required 
          />
        </div>
         <div className={styles.inputGroup}>
          <input 
            type="password" 
            placeholder="Password" 
            className={styles.input} 
            required 
          />
        </div>
         <button type="submit" className={styles.button} disabled={loading }>
          {loading  ? "Authenticating..." : "Sign In"}
        </button>
    </form>

    <button 
       onClick={handleGoToSignUp}
        className={styles.linkButton}
      >
        Dont have an account? Sign Up
      </button>
    </div>
  )
}

export default Login;
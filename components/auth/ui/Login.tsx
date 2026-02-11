import useAuthStore from "../store/store";
import React, { useState } from "react";
import  styles  from "./ui.module.css";

function Login(){
  const { triggerTransition, setView, triggerError } = useAuthStore();
  const [loading , setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent)=>{
    e.preventDefault();
    setLoading(true);

    setTimeout(()=>{
      triggerTransition();
      setLoading(false);
    },1500);
  }

  return(
    <div className={styles.glassPanel}>
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
        onClick={() => setView('signup')} 
        className={styles.linkButton}
      >
        Dont have an account? Sign Up
      </button>

      <button 
        onClick={triggerError} 
        style={{ opacity: 0.3, fontSize: '0.7rem', color: 'red', background: 'transparent', border: 'none', cursor: 'pointer' }}
      >
        (Dev Only: Test Error)
      </button>
    </div>
  )
}

export default Login;
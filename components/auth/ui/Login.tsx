import useAuthStore from "../store/store";
import React, { useState } from "react";
import  styles  from "./ui.module.css";

function Login(){

  const [loading , setLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [feedback, setFeedback] = useState<{type:'error' | 'success' | null, text:string}>({type:null,text:''});

  const setView = useAuthStore((state) => state.setView);
  const triggerError = useAuthStore((state) => state.triggerError);
  const triggerSuccess = useAuthStore((state) => state.triggerSuccess);
  const setDashboardOpen = useAuthStore((state) => state.setDashboardOpen);
  const isAnimating = useAuthStore((state) => state.isAnimating); 


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setFeedback({ type: null, text: '' });

    try {
      
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      let isSuccess = false;
      if (username === "1" && password === "1") isSuccess=true

      if (isSuccess) {
        setFeedback({ type: 'success', text: 'Login Successful! Redirecting...' });
        triggerSuccess();
        setTimeout(()=> {
          setDashboardOpen(true)
          setView('dashboard');
        },1000)
        
      } else {
        triggerError();
        setFeedback({ type: 'error', text: 'Invalid Username or Password.' })
      }

    } catch (error) {
      console.error(error);
      triggerError(); 
    } finally {
      setLoading(false);
    }
  };

  const handleGoToSignUp = () => {
    if (loading || isAnimating) return;
    setView('signup');
  };

  return(
    <div className={styles.glassPanel} style={{opacity: isAnimating ? 0 : 1, pointerEvents: isAnimating ? 'none' : 'auto' }}>
    <div>
      <h1 className={styles.title}>Welcome</h1>
 
      <h2 className={styles.subtitle} style={{ color: 'rgba(104, 255, 44, 0.88)'}}> Login test  User&Pass : 1 </h2>
      <h2 className={styles.subtitle} style={{ color: 'rgba(255, 44, 44, 0.88)'}}> Error test  User&Pass : 2 </h2>
  
    </div>
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }} >
      <div className={styles.inputGroup}>
          <input 
            type="text" 
            placeholder="Username" 
            className={styles.input} 
            required 
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            
          />
        </div>
         <div className={styles.inputGroup}>
          <input 
            type="password" 
            placeholder="Password" 
            className={styles.input} 
            required 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

         <button type="submit" className={styles.button} disabled={loading }>
          {loading  ? "Authenticating..." : "Sign In"}
        </button>

         <div className={`${styles.feedbackMessage} ${feedback.type === 'error' ? styles.feedbackError : feedback.type === 'success' ? styles.feedbackSuccess : ''}`}>
          {feedback.text}
        </div>
        
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
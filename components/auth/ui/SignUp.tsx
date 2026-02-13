import useAuthStore from "..//store/store";
import styles from "./ui.module.css";
import { useState } from "react";

const SignUp = () => {
  const { setView } = useAuthStore();
  const triggerSuccess = useAuthStore((state) => state.triggerSuccess);
  const isAnimating = useAuthStore((state) => state.isAnimating);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'error' | 'success' | null, text: string }>({
    type: null,
    text: ''
  });


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setFeedback({ type: null, text: '' });

    triggerSuccess();
    setFeedback({ type: 'success', text: 'Account Created! Redirecting...' });

    setTimeout(() => {
      setLoading(false);
      setView('login');
    }, 1500);
  };

  return (
    <div className={styles.glassPanel} style={{opacity: isAnimating ? 0 : 1, pointerEvents: isAnimating ? 'none' : 'auto' }}>
      <div>
        <h2 className={styles.title}>Join the Void</h2>
        <p className={styles.subtitle}>Create your account to start the journey.</p>
      </div>
      
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
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
            type="email" 
            placeholder="Email Address" 
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
        
        <button type="submit" className={styles.button} disabled={loading}>
          {loading ? "Creating Account..." : "Sign Up"}
        </button>
      </form>

      <div className={`${styles.feedbackMessage} ${feedback.type === 'error' ? styles.feedbackError : feedback.type === 'success' ? styles.feedbackSuccess : ''}`}>
          {feedback.text}
        </div>

      <button 
        onClick={() => setView('login')} 
        className={styles.linkButton}
      >
        Already have an account? Sign In
      </button>
    </div>
  );
};

export default SignUp;

import { useState } from "react";
import useAuthStore from "../store/store";
import styles from './ui.module.css';

function Dashboard(){
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const setView = useAuthStore((state) => state.setView);
  
  const handleLogoutClick = () => {
    setShowLogoutConfirm(true);
  };

  const confirmLogout = () => {
    setView('login');
    setShowLogoutConfirm(false);
  };

  const cancelLogout = () => {
    setShowLogoutConfirm(false);
  };

   return (
    <div className={`${styles.glassPanel} ${styles.dashboardPanel}`}>

      <div className={styles.dashboardHeader}>
        <h2 className={styles.title}>Dashboard</h2>
        <button className={styles.btnLogout} onClick={handleLogoutClick}>
          Logout
        </button>
      </div>

      <div className={styles.userProfile}>
        <h3>Your Info</h3>
        <div className={styles.userInfo}>
          <span className="nameUser">your name : Renium</span>
          <span className="emailUser">your email : example@gmail.com</span>
          <span className="passUser">your password : 1</span>
        </div>
      </div>

      <div className={styles.projectInfo}>
        <h3>Project Info</h3>
        <button className={styles.linkButton}>
           <a href="https://github.com/Mr3DWeb" target="_blank" rel="noreferrer">Github</a> 
        </button>
      </div>

      <div className={styles.socialMedia}>
        <h3>Social Media</h3>
        <button className={styles.linkButton}>
           <a href="https://www.linkedin.com/in/mr3dweb/" target="_blank" rel="noreferrer">Linkedin</a>
        </button>
        <button className={styles.linkButton}>
           <a href="https://mr3dweb.com/" target="_blank" rel="noreferrer">Website</a>
        </button>
      </div>

      {showLogoutConfirm && (
        <div className={styles.overlay}>
          <div className={styles.popup}>
            <h4 className={styles.popupTitle}>Confirm Logout</h4>
            <p className={styles.popupText}>Are you sure you want to exit?</p>
            <div className={styles.popupActions}>
              <button className={styles.btnCancel} onClick={cancelLogout}>
                Cancel
              </button>
              <button className={styles.btnConfirm} onClick={confirmLogout}>
                Yes, Logout
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}


export default Dashboard;
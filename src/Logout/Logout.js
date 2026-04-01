import './Logout.css';
import { useNavigate } from "react-router";
import { useEffect } from "react";


export default function LogoutPage() {
    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("loggedInUser"));
        if (!user) {
            navigate("/");
        }
    }, []);
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("loggedInUser");
        window.dispatchEvent(new Event("authChange")); // ← add this
        navigate("/");
    };

    const handleCancel = () => {
        navigate(-1);
    };

  return (
    <div className="logout-layout">
      <div className="card logout-card">

        <div className="logout-avatar-wrap">
          <div className="avatar avatar--large">
            <svg viewBox="0 0 24 24" fill="none" className="avatar-icon avatar-icon--large" stroke="currentColor" strokeWidth="2">
              <path d="M20 21a8 8 0 1 0-16 0" />
              <circle cx="12" cy="8" r="4" />
            </svg>
          </div>
        </div>

        <h1 className="logout-title">Log out?</h1>
        <p className="logout-desc">Are you sure you want to log out of your account?</p>

        {/* reuse btn-confirm / btn-cancel from HomePage.css */}
        <div className="logout-actions">
          <button className="btn-confirm" onClick={handleLogout}>
            Log out
          </button>
          <button className="btn-cancel" onClick={handleCancel}>
            <svg viewBox="0 0 24 24" fill="none" className="btn-icon" stroke="currentColor" strokeWidth="2.5">
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
            Cancel
          </button>
        </div>

      </div>
    </div>
  );
}
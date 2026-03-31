import './Register.css';
import { Link } from "react-router";

export default function RegisterPage() {
  return (
    <>
      <main className="app-main">
        <div className="main-inner login-section">

          {/* Header */}
          <section className="card header-card">
            <div className="header-inner">
              <div className="avatar">
                <svg viewBox="0 0 24 24" fill="none" className="avatar-icon" stroke="currentColor" strokeWidth="2">
                  <path d="M20 21a8 8 0 1 0-16 0" />
                  <circle cx="12" cy="8" r="4" />
                </svg>
              </div>
              <div>
                <p className="welcome-label">Create account</p>
                <h1 className="user-name">Register</h1>
              </div>
            </div>
          </section>

          <section className="card upload-card login-card">
            
            <div className="login-form">

              <input
                type="text"
                placeholder="Full name"
                className="login-input"
              />

              <input
                type="email"
                placeholder="Email"
                className="login-input"
              />

              <input
                type="password"
                placeholder="Password"
                className="login-input"
              />

              <input
                type="password"
                placeholder="Confirm password"
                className="login-input"
              />

              <button className="btn-primary login-btn">
                Create account
              </button>

              <div className="login-extra">
                <p className="login-text">
                  Already have an account?
                </p>
                <Link to="/login" className="btn-outline login-signup-btn">
                Login
                </Link>
              </div>

            </div>
          </section>

        </div>
      </main>
    </>
  );
}
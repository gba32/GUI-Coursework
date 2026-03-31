import './Login.css';
import { Link } from "react-router";

export default function LoginPage() {
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
                <p className="welcome-label">Welcome back</p>
                <h1 className="user-name">Login</h1>
              </div>
            </div>
          </section>

          {/* Login Card */}
          <section className="card upload-card login-card">
            
            <div className="login-form">

              {/* Email */}
              <input
                type="email"
                placeholder="Email"
                className="login-input"
              />

              {/* Password */}
              <input
                type="password"
                placeholder="Password"
                className="login-input"
              />

              {/* Login button */}
              <button className="btn-primary login-btn">
                Login
              </button>

              {/* Extra actions */}
              <div className="login-extra">
                <p className="login-text">
                  Don’t have an account?
                </p>

                <Link to="/register" className="btn-outline login-signup-btn">
                  Register
                </Link>
              </div>

            </div>
          </section>

        </div>
      </main>
    </>
  );
}
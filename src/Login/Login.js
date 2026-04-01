import './Login.css';
import { Link, useNavigate } from "react-router";
import { useState } from "react";

export default function LoginPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = () => {
    // basic validation
    if (!email || !password) {
      setError("Please enter email and password");
      return;
    }

    // WE NEED THE PIPE INCASE THEY HAVENT REGISTERED YET
    const users = JSON.parse(localStorage.getItem("users")) || []; 

    const foundUser = users.find(
      (user) => user.email === email && user.password === password
    );

    if (!foundUser) {
      setError("Invalid email or password");
      return;
    }

    localStorage.setItem("loggedInUser", JSON.stringify(foundUser));
    window.dispatchEvent(new Event("authChange")); // ← add this
    navigate("/");
  };

  return (
    <>
      <main className="app-main">
        <div className="main-inner login-section">

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
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              {/* Password */}
              <input
                type="password"
                placeholder="Password"
                className="login-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              {/* Login button */}
              <button className="btn-primary login-btn" onClick={handleLogin}>
                Login
              </button>

              {/* Error message */}
              {error && (
                <p style={{ color: "red", textAlign: "center" }}>
                  {error}
                </p>
              )}

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
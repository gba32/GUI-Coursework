import './Register.css';
import { Link, useNavigate } from "react-router";
import { useState } from "react";

export default function RegisterPage() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const handleRegister = () => {
    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    const users = JSON.parse(localStorage.getItem("users")) || [];

    // check if user already exists
    const exists = users.find(user => user.email === email);

    if (exists) {
      setError("User already exists");
      return;
    }

    // add new user
    users.push({
      name,
      email,
      password
    });

    localStorage.setItem("users", JSON.stringify(users));

    // redirect to login
    navigate("/login");
  };

  return (
    <>
      <main className="app-main">
        <div className="main-inner login-section">

          <section className="card header-card">
            <div className="header-inner">
              <div className="avatar">
                <svg viewBox="0 0 24 24" fill="none" className="avatar-icon" stroke="currentColor" strokeWidth="2">
                    {/* to make a random avatar as the jpg was making some errors */}
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
                placeholder="Fullname"
                className="login-input"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />

              <input
                type="email"
                placeholder="Email"
                className="login-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <input
                type="password"
                placeholder="Password"
                className="login-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <input
                type="password"
                placeholder="Confirm password"
                className="login-input"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />

              <button className="btn-primary login-btn" onClick={handleRegister}>
                Create account
              </button>

              {error && (
                <p style={{ color: "red", textAlign: "center" }}>
                  {error}
                </p>
              )}

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
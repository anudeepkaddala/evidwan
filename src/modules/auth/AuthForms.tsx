import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../context/UserContext.tsx";
import "./AuthForms.css";
import logo from "../../assets/logo2.png";

type User = {
  email: string;
  username: string;
  password: string;
  role: string;
};

const AuthForm = () => {
  const navigate = useNavigate();
  const { setUser } = useUser();
  const [isLogin, setIsLogin] = useState(true);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("Student");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    setError("");
    setSuccess("");
  }, [isLogin, isForgotPassword]);

  const validateEmail = (email: string): boolean => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSignup = async () => {
    if (!email || !username || !password || !confirmPassword || !role || !otp) {
      setSuccess("");
      return setError("All fields are required.");
    }
    if (!validateEmail(email)) {
      setSuccess("");
      return setError("Invalid email format.");
    }
    if (password !== confirmPassword) {
      setSuccess("");
      return setError("Passwords do not match.");
    }
  
    try {
      const response = await fetch("http://localhost:5000/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, username, password, confirmPassword, role, otp }),
      });
      const data = await response.json();
      if (response.status === 201) {
        setSuccess(data.message);
        setEmail("");
        setUsername("");
        setPassword("");
        setConfirmPassword("");
        setOtp("");
        setRole("Student");
        setIsLogin(true);
        setError("");
      } else {
        setSuccess("");
        setError(data.error);
      }
    } catch (error) {
      setSuccess("");
      console.error("Error during signup:", error);
      setError("Error during signup.");
    }
  };

  const handleSendSignupOtp = async () => {
    if (!email) {
      setSuccess("");
      return setError("Email is required.");
    }
    try {
      const response = await fetch("http://localhost:5000/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();
      if (response.status === 200) {
        setError("");
        setSuccess(data.message);
      } else {
        setSuccess("");
        setError(data.error);
      }
    } catch (error) {
      console.error("Error during sending signup OTP:", error);
      setSuccess("");
      setError("Error during sending signup OTP.");
    }
  };

  const handleSendForgotPasswordOtp = async () => {
    if (!email) {
      return setError("Email is required.");
    }
    try {
      const response = await fetch("http://localhost:5000/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();
      if (response.status === 200) {
        setSuccess(data.message);
      } else {
        setError(data.error);
      }
    } catch (error) {
      console.error("Error during sending forgot password OTP:", error);
      setError("Error during sending forgot password OTP.");
    }
  };

  const handleLogin = async () => {
    if (!email || !password) {
      return setError("Email and password are required.");
    }
    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (response.status === 200) {
        setUser(data.user);
        navigate(data.user.role === "Instructor" ? "/instructor/home" : "/student/home");
      } else {
        setError(data.error);
      }
    } catch (error) {
      console.error("Error during login:", error);
      setError("Error during login.");
    }
  };

  const handleResetPassword = async () => {
    if (!email || !otp || !password || !confirmPassword) {
      setSuccess("");
      return setError("Email, OTP, new password, and confirm password are required.");
    }
    if (password !== confirmPassword) {
      setSuccess("");
      return setError("Passwords do not match.");
    }
    try {
      const response = await fetch("http://localhost:5000/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp, newPassword: password, confirmPassword }),
      });
      const data = await response.json();
      if (response.status === 200) {
        setError("");
        setSuccess(data.message);
        setIsForgotPassword(false);
      } else {
        setSuccess("");
        setError(data.error);
      }
    } catch (error) {
      setSuccess("");
      console.error("Error during reset password:", error);
      setError("Error during reset password.");
    }
  };

  return (
    <>
      <img src={logo} className="img img-rounded mx-auto d-block w-25 pt-5" alt="Logo" />
      <div className="form-modal">
        <div className="form-toggle">
          <button
            id="login-toggle"
            onClick={() => {
              setIsLogin(true);
              setIsForgotPassword(false);
            }}
            className={isLogin ? "active-toggle" : "inactive-toggle"}
          >
            Log In
          </button>
          <button
            id="signup-toggle"
            onClick={() => {
              setIsLogin(false);
              setIsForgotPassword(false);
            }}
            className={!isLogin ? "active-toggle" : "inactive-toggle"}
          >
            Sign Up
          </button>
        </div>
        <form className="formData">
          {!isLogin && (
            <>
              <input
                type="text"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <button type="button" className="btn btn-secondary" onClick={handleSendSignupOtp}>
                Send OTP
              </button>
              <input
                type="text"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />
              <input
                type="text"
                placeholder="Choose username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <input
                type="password"
                placeholder="Create password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <input
                type="password"
                placeholder="Confirm password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <div className="form-select-wrapper">
                <select
                  className="form-select"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                >
                  <option>Student</option>
                  <option>Instructor</option>
                </select>
              </div>
              <button type="button" className="btn btn-secondary signup" onClick={handleSignup}>
                Create Account
              </button>
            </>
          )}

          {isLogin && !isForgotPassword && (
            <>
              <input
                type="text"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <input
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button type="button" className="btn btn-secondary login" onClick={handleLogin}>
                Login
              </button>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setIsForgotPassword(true);
                }}
                style={{ color: "blue", textDecoration: "underline", cursor: "pointer" }}
              >
                Forgot Password?
              </a>
            </>
          )}

          {isForgotPassword && (
            <>
              <input
                type="text"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <button type="button" onClick={handleSendForgotPasswordOtp}>
                Send OTP
              </button>
              <input
                type="text"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />
              <input
                type="password"
                placeholder="Enter new password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <input
                type="password"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <button type="button" onClick={handleResetPassword}>
                Reset Password
              </button>
              <button type="button" onClick={() => setIsForgotPassword(false)}>
                Back to Login
              </button>
            </>
          )}
          {error && <p style={{ color: "red", marginTop: "10px" }}>{error}</p>}
          {success && <p style={{ color: "green", marginTop: "10px" }}>{success}</p>}
          <hr />
        </form>
      </div>
    </>
  );
};

export default AuthForm;
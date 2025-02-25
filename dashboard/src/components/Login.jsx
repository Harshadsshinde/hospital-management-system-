import React, { useContext, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Context } from "../main";
import axios from "axios";

const Login = () => {
  // Local state for email, password, and confirmPassword
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Use context to track authentication status
  const { isAuthenticated, setIsAuthenticated } = useContext(Context);
  const navigateTo = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    // Client-side validation: Ensure all fields are filled
    if (!email || !password || !confirmPassword) {
      toast.error("Please fill full form");
      return;
    }
    
    // Validate that password and confirmPassword match
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      // Send email, password, confirmPassword, and role (if required)
      const { data } = await axios.post(
        "http://localhost:4000/api/v1/user/login",
        { email, password, confirmPassword, role: "Admin" },
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      );
      
      toast.success(data.message);
      setIsAuthenticated(true);
      navigateTo("/"); // Redirect to home or admin dashboard

      // Clear the form fields after successful login
      setEmail("");
      setPassword("");
      setConfirmPassword("");
    } catch (error) {
      console.error("Login error:", error);
      toast.error(
        error.response?.data?.message || "Login failed. Please try again."
      );
    }
  };

  // If already authenticated, redirect away from the login page
  if (isAuthenticated) {
    return <Navigate to="/" />;
  }

  return (
    <section className="container form-component">
      <img src="/logo.png" alt="logo" className="logo" />
      <h1 className="form-title">WELCOME TO ZEECARE</h1>
      <p>Only Admins Are Allowed To Access These Resources!</p>
      <form onSubmit={handleLogin}>
        <input
          type="text"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
          <button type="submit">Login</button>
        </div>
      </form>
    </section>
  );
};

export default Login;

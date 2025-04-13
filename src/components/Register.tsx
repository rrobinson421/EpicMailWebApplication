import { useNavigate } from 'react-router-dom';
import React, { useState } from 'react';
import '/src/styles/AuthenticationStyle.css'

// Router
const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("http://127.0.0.1:5000/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      setMessage(data.message);

      if (response.ok) {
        console.log("Registration successful");
        // Redirect to login page on successful registration
        navigate("/login");
      } else {
        console.error("Registration failed");
      }
    } catch (error) {
      console.error("Error:", error);
      setMessage("An error occurred. Please try again.");
    }
  };

  // Handle register page
  return (
    <div className="register">
      <h1 className="register__title">Register</h1>
      <div className="register__form" onSubmit={handleRegister}>
        <div>
          <label htmlFor="email" className="register__label">Email:</label>
          <input type="email" id="email" className="register__input" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div>
          <label htmlFor="password" className="register__label">Password:</label>
          <input type="password" id="password" className="register__input" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <button onClick={handleRegister} className="register__button">Register</button>
        {message && <p className="register__message">{message}</p>}
      </div>
    </div>
  );
};

// path="/register"
export default RegisterPage;

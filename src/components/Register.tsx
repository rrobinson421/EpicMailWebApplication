import { useNavigate } from 'react-router-dom';
import React, { useState } from 'react';
import '/src/styles/AuthenticationStyle.css';

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"success" | "error" | null>(null);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    // Send a POST request to the server to register the user
    try {
      const response = await fetch("http://127.0.0.1:5000/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      setMessage(data.message);

      // Check if the registration was successful
      if (response.ok) {
        setStatus("success");
        console.log("Registration successful");
        navigate("/login", { state: { message: "Registration successful!" } });
      } else {
        setStatus("error");
        console.error("Registration failed");
      }
    } catch (error) {
      console.error("Error:", error);
      setStatus("error");
      setMessage("An error occurred. Please try again.");
    }
  };

  return (
    <div className="register">
      <h1 className="register__title">Register</h1>
      <form className="register__form" onSubmit={handleRegister}>
        <div>
          <label htmlFor="email" className="register__label">Email:</label>
          <input
            type="email"
            id="email"
            className="register__input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="password" className="register__label">Password:</label>
          <input
            type="password"
            id="password"
            className="register__input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="register__button">Register</button>
        <button type="button" className="login_button" onClick={() => navigate("/login")}>Back to Login</button>
        {message && (
          <p
            className="register__message"
            style={{ color: status === "success" ? "green" : "red", marginTop: "10px", fontSize: "20px" }}
          >
            {message}
          </p>
        )}
      </form>
    </div>
  );
};

export default RegisterPage;

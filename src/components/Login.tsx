import { useNavigate, useLocation } from 'react-router-dom';
import '/src/styles/AuthenticationStyle.css';
import React, { useState, useEffect } from 'react';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const successMessage = location.state?.message;

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<"success" | "error" | null>(null);

  useEffect(() => {
    if (successMessage) {
      setMessage(successMessage);
      setStatus("success");
    }
  }, [successMessage]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('http://127.0.0.1:5000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log('Login successful:', data);
        localStorage.setItem('userEmail', data.email);
        setStatus("success");
        setMessage("Login successful!");
        navigate('/email-management');
      } else {
        setStatus("error");
        setMessage(data.error || "Invalid email or password.");
        console.error('Login failed:', data.error);
      }
    } catch (error) {
      console.error('Error during login:', error);
      setStatus("error");
      setMessage("An error occurred. Please try again.");
    }
  };

  const handleRegister = () => {
    navigate('/register');
  };

  return (
    <div className="login">
      <h1 className="login__title">Welcome!</h1>
      <form className="login__form" onSubmit={handleLogin}>
        <div>
          <label htmlFor="email" className="login__label">Email:</label>
          <input
            type="email"
            id="email"
            className="login__input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="password" className="login__label">Password:</label>
          <input
            type="password"
            id="password"
            className="login__input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="login__button">Log in</button>
        <button type="button" onClick={handleRegister} className="login__button">Register</button>

        {message && (
          <p
            className="login__message"
            style={{ color: status === "success" ? "green" : "red", marginTop: "10px", fontSize: "20px" }}
          >
            {message}
          </p>
        )}
      </form>
    </div>
  );
};

export default LoginPage;

import { useNavigate } from 'react-router-dom';
import '/src/styles/AuthenticationStyle.css'
import React from 'react';
// Router
const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');

  const handleLogin = async () => {
    try {
      const response = await fetch('http://127.0.0.1:5000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email, // Assuming the backend expects "username"
          password: password,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Login successful:', data);
        navigate('/email-management'); // Redirect on successful login
      } else {
        const errorData = await response.json();
        console.error('Login failed:', errorData.error);
        alert('Invalid username or password');
      }
    } catch (error) {
      console.error('Error during login:', error);
      alert('An error occurred. Please try again.');
    }
  };

  const handleRegister = () => {
    navigate('/register');
  };

  // Handle login page
  return (
    <div className="login">
      <h1 className="login__title">Welcome!</h1>
      <div className="login__form">
        <div>
          <label htmlFor="email" className="login__label">Email:</label>
          <input type="email" id="email" className="login__input" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div>
          <label htmlFor="password" className="login__label">Password:</label>
          <input type="password" id="password" className="login__input" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <button onClick={handleLogin} className="login__button">Log in</button>
        <button onClick={handleRegister} className="login__button">Register</button>
      </div>
    </div>
  );
};

// path="/login"
export default LoginPage;

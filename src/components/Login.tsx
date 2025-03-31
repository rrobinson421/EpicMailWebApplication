import { useNavigate } from 'react-router-dom';
import '/src/styles/AuthenticationStyle.css'

// Router
const LoginPage: React.FC = () => {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate('/email-management');
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
          <input type="email" id="email" className="login__input" required />
        </div>
        <div>
          <label htmlFor="password" className="login__label">Password:</label>
          <input type="password" id="password" className="login__input" required />
        </div>
        <button onClick={handleLogin} className="login__button">Log in</button>
        <button onClick={handleRegister} className="login__button">Register</button>
      </div>
    </div>
  );
};

// path="/login"
export default LoginPage;

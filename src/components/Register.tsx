import { useNavigate } from 'react-router-dom';
import '/src/styles/AuthenticationStyle.css'

// Router
const RegisterPage: React.FC = () => {
  const navigate = useNavigate();

  const handleRegister = () => {
    navigate('/login');
  };

  // Handle register page
  return (
    <div className="register">
      <h1 className="register__title">Register</h1>
      <div className="register__form">
        <div>
          <label htmlFor="email" className="register__label">Email:</label>
          <input type="email" id="email" className="register__input" required />
        </div>
        <div>
          <label htmlFor="password" className="register__label">Password:</label>
          <input type="password" id="password" className="register__input" required />
        </div>
        <button onClick={handleRegister} className="register__button">Create new account</button>
      </div>
    </div>
  );
};

// path="/register"
export default RegisterPage;

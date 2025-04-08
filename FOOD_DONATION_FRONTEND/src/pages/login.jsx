import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Login.css';
import NavBar from '../components/nabar';
const Login = ({ afterLogin, User, handleLogout }) => {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        import.meta.env.VITE_BACKEND_URL + '/users/login',
        {
          method: 'POST',
          body: JSON.stringify(credentials),
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
        }
      );

      const result = await response.json();

      if (result.status === 'fail') {
        alert(result.message);
        return;
      }

      afterLogin(result); // Call afterLogin function from App.jsx
      navigate('/'); // Redirect after login
    } catch (error) {
      console.error('Error logging in:', error);
    }
  };

  return (
    <>
      <NavBar User={User} handleLogout={handleLogout} />
      <div className="login-container">
        <form onSubmit={handleSubmit} className="login-form">
          <h1>Login</h1>
          <label>Email</label>
          <input
            type="email"
            name="email"
            placeholder="Enter email"
            value={credentials.email}
            onChange={handleChange}
            required
          />

          <label>Password</label>
          <input
            type="password"
            name="password"
            placeholder="Enter password"
            value={credentials.password}
            onChange={handleChange}
            required
          />

          <button type="submit">Login</button>
          <h5 className="details">
            Dont have an account
            <span>
              <Link to="/signup" className="signup">
                Signup
              </Link>
            </span>
          </h5>
        </form>
      </div>
    </>
  );
};

export default Login;

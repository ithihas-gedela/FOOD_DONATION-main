import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// import Footer from '../components/footer';
import NavBar from '../components/nabar';
import './signup.css';
import { Link } from 'react-router-dom';

const SignUp = ({ User, handleLogout }) => {
  const [otpDetails, setOtpDetails] = useState({ email: '' });
  const [userDetails, setUserDetails] = useState({
    name: '',
    password: '',
    confirmPassword: '',
    role: 'resturant',
    phone: '',
    address: '',
    otp: '',
  });

  const [isOtpSent, setIsOtpSent] = useState(false);
  const navigate = useNavigate();

  const handleOtpChange = (key, value) => {
    setOtpDetails((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleUserChange = (key, value) => {
    setUserDetails((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSubmitOtp = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(import.meta.env.VITE_BACKEND_URL + '/otps', {
        method: 'POST',
        body: JSON.stringify(otpDetails),
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });

      const result = await response.json();
      if (result.status === 'failure') {
        alert(result.message);
        return;
      }
      alert('OTP sent successfully.');
      setIsOtpSent(true);
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (userDetails.password !== userDetails.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }

    try {
      const response = await fetch(
        import.meta.env.VITE_BACKEND_URL + '/users/register',
        {
          method: 'POST',
          body: JSON.stringify({ ...otpDetails, ...userDetails }),
          headers: { 'Content-Type': 'application/json' },
        }
      );

      const result = await response.json();
      if (result.status === 'fail') {
        alert(result.message);
        return;
      }

      alert('Successfully registered!');
      navigate('/login');
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <>
      <NavBar User={User} handleLogout={handleLogout} />
      <div className="main-content">
        <div className="login-form">
          <h1 className="login-heading">Signup</h1>
          {!isOtpSent ? (
            // OTP Form
            <form onSubmit={handleSubmitOtp} className="form-details-login">
              <label>Email</label>
              <input
                className="input-details"
                type="email"
                name="email"
                placeholder="Enter your email"
                onChange={(e) => handleOtpChange('email', e.target.value)}
                required
              />
              <button type="submit" className="login-button-main">
                Send OTP
              </button>
              <h5 className="details1">
                Already have an account
                <span>
                  <Link to="/login" className="signup">
                    Signin
                  </Link>
                </span>
              </h5>
            </form>
          ) : (
            // User Registration Form
            <form onSubmit={handleSubmit} className="form-details-login">
              <h1 className="login-heading">Complete Registration</h1>
              <label>Email</label>
              <input
                className="input-details"
                type="email"
                name="email"
                value={otpDetails.email}
                readOnly
              />
              <label>Enter OTP</label>
              <input
                className="input-details"
                type="text"
                name="otp"
                placeholder="Enter OTP"
                onChange={(e) => handleUserChange('otp', e.target.value)}
                required
              />
              <label>Full Name</label>
              <input
                className="input-details"
                type="text"
                name="name"
                placeholder="Enter your full name"
                onChange={(e) => handleUserChange('name', e.target.value)}
                required
              />
              <label>Role</label>
              <select
                className="input-details"
                name="role"
                onChange={(e) => handleUserChange('role', e.target.value)}
                required
              >
                <option value="resturant">Restaurant</option>
                <option value="ngo">NGO</option>
                <option value="admin">Admin</option>
              </select>
              <label>Phone</label>
              <input
                className="input-details"
                type="text"
                name="phone"
                placeholder="Enter phone number"
                onChange={(e) => handleUserChange('phone', e.target.value)}
                required
              />
              <label>Address</label>
              <input
                className="input-details"
                type="text"
                name="address"
                placeholder="Enter your address"
                onChange={(e) => handleUserChange('address', e.target.value)}
                required
              />
              <label>Password</label>
              <input
                className="input-details"
                type="password"
                name="password"
                placeholder="Enter password"
                onChange={(e) => handleUserChange('password', e.target.value)}
                required
                minLength="6"
              />
              <label>Confirm Password</label>
              <input
                className="input-details"
                type="password"
                name="confirmPassword"
                placeholder="Confirm password"
                onChange={(e) =>
                  handleUserChange('confirmPassword', e.target.value)
                }
                required
              />
              <button type="submit" className="login-button-main">
                Register
              </button>
            </form>
          )}
        </div>
      </div>
      {/* <Footer /> */}
    </>
  );
};

export default SignUp;

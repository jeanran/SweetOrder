import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/login.css';

function Login() {
  const navigate = useNavigate();

  useEffect(() => {
    document.body.classList.add('page-loaded');
    return () => {
      document.body.classList.remove('page-loaded');
    };
  }, []);

  const goBack = () => {
    navigate(-1);
  };

  return (
    <div className="login-page">
      {/* Back Button */}
      <button className="back-button" onClick={goBack}>
        <i className="fa-solid fa-arrow-left"></i> Back
      </button>

      <Link to="/" className="back-home">
        <i className="fa-solid fa-arrow-left"></i>
        Back to Home
      </Link>
      
      <div className="container">
        {/* FORM CARD */}
        <div className="form-card">
          <form>
            <h2>Login to your account</h2>

            <div className="input-box">
              <input type="email" name="email" placeholder="Email" required />
              <i className="fa-solid fa-envelope"></i>
            </div>
            <div className="input-box">
              <input type="password" name="password" placeholder="Password" required />
              <i className="fa-solid fa-lock"></i>
            </div>
            
            <Link to="/Homepage"><button type="submit" className="signup-btn">Login</button></Link>

            <Link to="/register">
              <p className="login-text">Don't have an account?</p>
            </Link>
            
              <p className="forgot-password">Forgot Password?</p>
          
          </form>
        </div>

        {/* SIDE LOGO IMAGE */}
        <div className="image-box">
          <img src="/assets/lgo.png" alt="Logo" />
        </div>
      </div>
    </div>
  );
}

export default Login;
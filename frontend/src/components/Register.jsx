import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/register.css';

function Register() {
  useEffect(() => {
    document.body.classList.add('page-loaded');
    return () => {
      document.body.classList.remove('page-loaded');
    };
  }, []);

  return (
    <div className="register-page">
      <Link to="/" className="back-home">
        <i className="fa-solid fa-arrow-left"></i>
        Back to Home
      </Link>
      
      <div className="container">
        {/* FORM CARD */}
        <div className="form-card">
          <form>
            <h2>Create Account</h2>

            <div className="input-box">
              <input type="text" name="name" placeholder="Full Name" required />
              <i className="fa-solid fa-user"></i>
            </div>
            
            <div className="input-box">
              <input type="email" name="email" placeholder="Email" required />
              <i className="fa-solid fa-envelope"></i>
            </div>

            <div className="input-box">
              <input type="password" name="password" placeholder="Password" required />
              <i className="fa-solid fa-lock"></i>
            </div>

            <div className="input-box">
              <input type="password" name="confirm_password" placeholder="Confirm Password" required />
              <i className="fa-solid fa-lock"></i>
            </div>
            
            <button type="submit" className="signup-btn">Create Account</button>
            
            <p className="login-text">
              Already have an account? <Link to="/login">Login</Link>
            </p>
          </form>
        </div>

        {/* SIDE IMAGE */}
        <div className="image-box">
          <img src="/assets/lgo.png" alt="SweetOrder Logo" />
        </div>
      </div>
    </div>
  );
}

export default Register;
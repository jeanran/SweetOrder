import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api'; // Import the api service
import '../styles/register.css';

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirm_password: ""
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    document.body.classList.add('page-loaded');
    
    // Check if already logged in
    const user = localStorage.getItem('user');
    if (user) {
      const userData = JSON.parse(user);
      if (userData.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/customer/home');
      }
    }
    
    return () => {
      document.body.classList.remove('page-loaded');
    };
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Clear error when user types
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Check password match
    if (formData.password !== formData.confirm_password) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    // Check password length
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long");
      setLoading(false);
      return;
    }

    // Email validation (basic)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Please enter a valid email address");
      setLoading(false);
      return;
    }

    try {
      // Using api service instead of fetch directly
      const response = await api.post('/auth/register/', {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        confirm_password: formData.confirm_password,
        role: "customer"
      });

      console.log('Registration response:', response.data);

      if (response.status === 201 || response.status === 200) {
        // Success message
        alert("Account created successfully! Please login.");
        
        // Redirect to login page with email pre-filled
        navigate("/login", { 
          state: { 
            email: formData.email,
            message: "Registration successful! Please login." 
          } 
        });
      }

    } catch (err) {
      console.error("Registration error:", err);
      
      // Better error handling similar to Login.jsx
      if (err.response) {
        // The request was made and the server responded with an error status
        console.log('Error response data:', err.response.data);
        console.log('Error response status:', err.response.status);
        
        if (err.response.status === 400) {
          // Handle validation errors from Django
          const errorData = err.response.data;
          
          if (errorData.email) {
            setError(Array.isArray(errorData.email) ? errorData.email[0] : errorData.email);
          } else if (errorData.password) {
            setError(Array.isArray(errorData.password) ? errorData.password[0] : errorData.password);
          } else if (errorData.non_field_errors) {
            setError(Array.isArray(errorData.non_field_errors) ? errorData.non_field_errors[0] : errorData.non_field_errors);
          } else if (errorData.error) {
            setError(errorData.error);
          } else if (typeof errorData === 'string') {
            setError(errorData);
          } else {
            setError("Registration failed. Please check your information.");
          }
        } else if (err.response.status === 409) {
          setError("Email already exists. Please use a different email or login.");
        } else {
          setError(`Server error (${err.response.status}). Please try again.`);
        }
      } else if (err.request) {
        // The request was made but no response was received
        setError("Cannot connect to server. Make sure Django is running on port 8000.");
      } else {
        // Something happened in setting up the request
        setError("An error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page">
      <Link to="/" className="back-home">
        <i className="fa-solid fa-arrow-left"></i>
        Back to Home
      </Link>

      <div className="container">

        {/* FORM CARD */}
        <div className="form-card">
          <form onSubmit={handleSubmit}>
            <h2>Create Account</h2>

            {error && (
              <div className="error-message" style={{
                backgroundColor: '#ffebee',
                color: '#c62828',
                padding: '12px',
                borderRadius: '8px',
                marginBottom: '20px',
                textAlign: 'center',
                fontSize: '14px',
                border: '1px solid #ffcdd2'
              }}>
                <i className="fa-solid fa-exclamation-circle" style={{ marginRight: '8px' }}></i>
                {error}
              </div>
            )}

            <div className="input-box">
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                required
                value={formData.name}
                onChange={handleChange}
                disabled={loading}
              />
              <i className="fa-solid fa-user"></i>
            </div>

            <div className="input-box">
              <input
                type="email"
                name="email"
                placeholder="Email"
                required
                value={formData.email}
                onChange={handleChange}
                disabled={loading}
              />
              <i className="fa-solid fa-envelope"></i>
            </div>

            <div className="input-box">
              <input
                type="password"
                name="password"
                placeholder="Password (min. 6 characters)"
                required
                minLength="6"
                value={formData.password}
                onChange={handleChange}
                disabled={loading}
              />
              <i className="fa-solid fa-lock"></i>
            </div>

            <div className="input-box">
              <input
                type="password"
                name="confirm_password"
                placeholder="Confirm Password"
                required
                minLength="6"
                value={formData.confirm_password}
                onChange={handleChange}
                disabled={loading}
              />
              <i className="fa-solid fa-lock"></i>
            </div>

            <button 
              type="submit" 
              className="signup-btn"
              disabled={loading}
              style={{
                opacity: loading ? 0.7 : 1,
                cursor: loading ? 'not-allowed' : 'pointer'
              }}
            >
              {loading ? (
                <>
                  <i className="fa-solid fa-spinner fa-spin" style={{ marginRight: '8px' }}></i>
                  Creating Account...
                </>
              ) : (
                'Create Account'
              )}
            </button>

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
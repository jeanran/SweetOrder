import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import api from '../services/api';
import '../styles/login.css';

function Login() {
  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState({
    email: location.state?.email || '',
    password: ''
  });

  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState(location.state?.message || '');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    document.body.classList.add('page-loaded');

    // ✅ FIXED: only check user, no token needed
    const user = localStorage.getItem('user');
    if (user) {
      try {
        const userData = JSON.parse(user);
        // ✅ FIXED: role-based redirect
        if (userData?.role === 'admin') {
          navigate('/admin/dashboard', { replace: true });
        } else if (userData?.role === 'customer') {
          navigate('/homepage', { replace: true });
        }
      } catch (err) {
        // Corrupted data — wipe it
        localStorage.removeItem('user');
        localStorage.removeItem('userId');
      }
    }

    return () => document.body.classList.remove('page-loaded');
  }, [navigate]);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // ✅ FIXED: correct endpoint
      const response = await api.post('/auth/login/', {
        email: formData.email,
        password: formData.password
      });

      if (response.status === 200 && response.data.user) {
        const user = response.data.user;

        // ✅ FIXED: no fake token, correct user_id field
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('userId', user.user_id);

        // ✅ FIXED: role-based redirect
        if (user.role === 'admin') {
          navigate('/admin/dashboard', { replace: true });
        } else {
          navigate('/homepage', { replace: true });
        }
      }

    } catch (err) {
      console.error('Login error:', err);

      if (err.response) {
        const status = err.response.status;
        const serverError = err.response.data?.error;

        if (status === 401)       setError('Invalid email or password.');
        else if (status === 404)  setError('User not found.');
        else if (serverError)     setError(serverError);
        else                      setError('Login failed. Please try again.');

      } else if (err.request) {
        setError('Cannot connect to server. Make sure Django is running on port 8000.');
      } else {
        setError('An unexpected error occurred. Please try again.');
      }

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <Link to="/" className="back-home">
        <i className="fa-solid fa-arrow-left"></i> Back to Home
      </Link>

      <div className="container">
        <div className="form-card">
          <form onSubmit={handleSubmit}>
            <h2>Login to your account</h2>

            {successMessage && (
              <div className="alert success-alert">
                <i className="fa-solid fa-check-circle"></i> {successMessage}
              </div>
            )}

            {error && (
              <div className="alert error-alert">
                <i className="fa-solid fa-exclamation-circle"></i> {error}
              </div>
            )}

            <div className="input-box">
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                required
                disabled={loading}
              />
              <i className="fa-solid fa-envelope"></i>
            </div>

            <div className="input-box">
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
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
                  <i className="fa-solid fa-spinner fa-spin"></i> Logging in...
                </>
              ) : (
                'Login'
              )}
            </button>

            <p className="login-text">
              Don't have an account? <Link to="/register">Register</Link>
            </p>

          </form>
        </div>

        <div className="image-box">
          <img src="/assets/lgo.png" alt="Logo" />
        </div>
      </div>
    </div>
  );
}

export default Login;
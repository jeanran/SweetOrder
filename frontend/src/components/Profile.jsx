import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import '../styles/Profile.css';

function Profile() {
  const navigate    = useNavigate();
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError]     = useState('');
  const [scrolled, setScrolled] = useState(false);
  const dropdownRef = useRef(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const [formData, setFormData] = useState({
    name: '', email: '', password: '', confirm_password: ''
  });

  useEffect(() => {
    document.body.classList.add('page-loaded');

    const stored = localStorage.getItem('user');
    if (!stored) { navigate('/login'); return; }
    const userData = JSON.parse(stored);
    setUser(userData);
    setFormData(prev => ({
      ...prev,
      name:  userData.name  || '',
      email: userData.email || '',
    }));

    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);

    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.body.classList.remove('page-loaded');
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [navigate]);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setError(''); setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setSuccess('');
    if (formData.password && formData.password !== formData.confirm_password) {
      setError('Passwords do not match.'); return;
    }
    if (formData.password && formData.password.length < 6) {
      setError('Password must be at least 6 characters.'); return;
    }
    setLoading(true);
    try {
      const payload = {
        name:    formData.name,
        email:   formData.email,
        user_id: localStorage.getItem('userId'),
      };
      if (formData.password) payload.password = formData.password;
      await api.patch('/auth/profile/', payload);
      const updated = { ...user, name: formData.name, email: formData.email };
      localStorage.setItem('user', JSON.stringify(updated));
      setUser(updated);
      setSuccess('Profile updated successfully!');
      setFormData(prev => ({ ...prev, password: '', confirm_password: '' }));
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try { await api.post('/auth/logout/'); } catch (e) {}
    localStorage.removeItem('user');
    localStorage.removeItem('userId');
    navigate('/login');
  };

  const getInitials = (name) => {
    if (!name) return '?';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <div className="profile-page">

      {/* ✅ SAME NAVBAR AS HOMEPAGE */}
      <header className={`navbar ${scrolled ? 'scrolled' : ''}`}>
        <div className="container nav-container">
          <div className="logo">
            <img className="logo-img" src="/assets/logos.png" alt="SweetOrder logo" />
          </div>
          <nav className="nav-links">
            <Link to="/homepage"     className="nav-link">Home</Link>
            <Link to="/about"        className="nav-link">About</Link>
            <Link to="/products"     className="nav-link">Cakes</Link>
            <Link to="/testimonials" className="nav-link">Testimonials</Link>
            <Link to="/contacts"     className="nav-link">Contacts</Link>
          </nav>
          <div className="nav-right">
            <Link to="/cart">
              <img className="cart-icon" src="/assets/cart.png" alt="Cart" />
            </Link>
            {user && (
              <div className="nav-profile-wrapper" ref={dropdownRef}>
                <button
                  className="nav-profile-avatar"
                  onClick={() => setDropdownOpen(p => !p)}
                >
                  {getInitials(user.name)}
                </button>
                {dropdownOpen && (
                  <div className="profile-dropdown">
                    <div className="dropdown-header">
                      <div className="dropdown-avatar">{getInitials(user.name)}</div>
                      <div>
                        <p className="dropdown-name">{user.name}</p>
                        <p className="dropdown-email">{user.email}</p>
                      </div>
                    </div>
                    <hr className="dropdown-divider" />
                    <Link to="/profile"  className="dropdown-item" onClick={() => setDropdownOpen(false)}>
                      <i className="fa-solid fa-user"></i> My Profile
                    </Link>
                    <Link to="/orders"   className="dropdown-item" onClick={() => setDropdownOpen(false)}>
                      <i className="fa-solid fa-box"></i> My Orders
                    </Link>
                    <Link to="/settings" className="dropdown-item" onClick={() => setDropdownOpen(false)}>
                      <i className="fa-solid fa-gear"></i> Settings
                    </Link>
                    <hr className="dropdown-divider" />
                    <button className="dropdown-item dropdown-logout" onClick={handleLogout}>
                      <i className="fa-solid fa-right-from-bracket"></i> Logout
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </header>

      {/* ✅ CONTENT */}
      <div className="profile-content">
        <div className="profile-grid">

          {/* LEFT — Avatar */}
          <div className="profile-avatar-card">
            <div className="profile-avatar-circle">
              {getInitials(user?.name)}
            </div>
            <h2 className="profile-avatar-name">{user?.name}</h2>
            <p className="profile-avatar-email">{user?.email}</p>
            <span className="profile-avatar-role">{user?.role}</span>

            <div className="profile-quick-links">
              {[
                { to: '/orders',   icon: 'fa-box',  label: 'My Orders' },
                { to: '/settings', icon: 'fa-gear', label: 'Settings'  },
              ].map(link => (
                <Link key={link.to} to={link.to} className="profile-quick-link">
                  <i className={`fa-solid ${link.icon}`}></i>
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* RIGHT — Form */}
          <div className="profile-form-card">
            <h3>Edit Profile</h3>

            {success && (
              <div className="profile-alert success">
                <i className="fa-solid fa-check-circle"></i> {success}
              </div>
            )}
            {error && (
              <div className="profile-alert error">
                <i className="fa-solid fa-exclamation-circle"></i> {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="profile-fields-grid">
                {[
                  { label: 'Full Name',        name: 'name',             type: 'text',     placeholder: 'Your full name' },
                  { label: 'Email Address',    name: 'email',            type: 'email',    placeholder: 'Your email' },
                  { label: 'New Password',     name: 'password',         type: 'password', placeholder: 'Leave blank to keep current' },
                  { label: 'Confirm Password', name: 'confirm_password', type: 'password', placeholder: 'Confirm new password' },
                ].map(field => (
                  <div key={field.name} className="profile-field">
                    <label>{field.label}</label>
                    <input
                      type={field.type}
                      name={field.name}
                      placeholder={field.placeholder}
                      value={formData[field.name]}
                      onChange={handleChange}
                    />
                  </div>
                ))}
              </div>

              <button type="submit" className="profile-submit-btn" disabled={loading}>
                {loading
                  ? <><i className="fa-solid fa-spinner fa-spin"></i> Saving...</>
                  : 'Save Changes'
                }
              </button>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Profile;
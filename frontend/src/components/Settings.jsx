import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import '../styles/Settings.css';

function Settings() {
  const navigate                        = useNavigate();
  const dropdownRef                     = useRef(null);
  const [user, setUser]                 = useState(null);
  const [loadingUser, setLoadingUser]   = useState(true);
  const [loading, setLoading]           = useState(false);
  const [success, setSuccess]           = useState('');
  const [error, setError]               = useState('');
  const [scrolled, setScrolled]         = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showConfirm, setShowConfirm]   = useState(false);
  const [notifications, setNotifications] = useState({
    orderUpdates: true,
    promotions:   false,
  });

  useEffect(() => {
    document.body.classList.add('page-loaded');

    const stored = localStorage.getItem('user');
    if (!stored) { navigate('/login'); return; }
    setUser(JSON.parse(stored));
    setLoadingUser(false);

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

  const handleLogout = async () => {
    try { await api.post('/auth/logout/'); } catch (e) {}
    localStorage.removeItem('user');
    localStorage.removeItem('userId');
    navigate('/login');
  };

  const handleNotifChange = (key) => {
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
    setSuccess('Preferences saved.');
    setTimeout(() => setSuccess(''), 2000);
  };

  const handleDeleteAccount = async () => {
    const userId = localStorage.getItem('userId');
    setLoading(true);
    try {
      await api.delete('/auth/profile/', { data: { user_id: userId } });
      localStorage.removeItem('user');
      localStorage.removeItem('userId');
      navigate('/register');
    } catch (err) {
      setError('Failed to delete account. Please try again.');
    } finally {
      setLoading(false);
      setShowConfirm(false);
    }
  };

  const getInitials = (name) => {
    if (!name) return '?';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  if (loadingUser) return (
    <div className="settings-loading">
      <i className="fa-solid fa-spinner fa-spin fa-2x"></i>
    </div>
  );

  return (
    <div className="settings-page">

      {/* ── NAVBAR ───────────────────────────────────── */}
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

      {/* ── CONTENT ──────────────────────────────────── */}
      <div className="settings-content">

        <div className="settings-heading">
          <h1>Settings</h1>
        </div>

        {/* Alerts */}
        {success && (
          <div className="settings-alert success">
            <i className="fa-solid fa-check-circle"></i> {success}
          </div>
        )}
        {error && (
          <div className="settings-alert error">
            <i className="fa-solid fa-exclamation-circle"></i> {error}
          </div>
        )}

        <div className="settings-grid">

          {/* ── LEFT COLUMN ────────────────────────── */}
          <div className="settings-left">

            {/* Account Card */}
            <div className="settings-card">
              <h4 className="settings-card-title">
                <i className="fa-solid fa-user"></i> Account
              </h4>

              <div className="settings-user-info">
                <div className="settings-avatar">
                  {getInitials(user?.name)}
                </div>
                <div className="settings-user-text">
                  <p className="settings-user-name">{user?.name}</p>
                  <p className="settings-user-email">{user?.email}</p>
                  <span className="settings-user-role">{user?.role}</span>
                </div>
              </div>

              <div className="settings-account-btns">
                <button className="settings-action-btn" onClick={() => navigate('/profile')}>
                  <i className="fa-solid fa-pen"></i> Edit Profile
                </button>
                <button className="settings-action-btn" onClick={() => navigate('/orders')}>
                  <i className="fa-solid fa-box"></i> My Orders
                </button>
              </div>
            </div>

            {/* About Card */}
            <div className="settings-card">
              <h4 className="settings-card-title">
                <i className="fa-solid fa-circle-info"></i> About
              </h4>
              <div className="settings-about">
                <p><span>App</span> SweetOrder</p>
                <p><span>Version</span> 1.0.0</p>
                <p><span>Built with</span> React + Django REST Framework</p>
              </div>
            </div>

          </div>

          {/* ── RIGHT COLUMN ───────────────────────── */}
          <div className="settings-right">

            {/* Notifications Card */}
            <div className="settings-card">
              <h4 className="settings-card-title">
                <i className="fa-solid fa-bell"></i> Notifications
              </h4>

              {[
                {
                  key:     'orderUpdates',
                  label:   'Order status updates',
                  subtext: 'Get notified when your order status changes'
                },
                {
                  key:     'promotions',
                  label:   'Promotions and offers',
                  subtext: 'Receive special deals and discounts'
                },
              ].map(item => (
                <div key={item.key} className="settings-toggle-row">
                  <div>
                    <p className="toggle-label">{item.label}</p>
                    <p className="toggle-subtext">{item.subtext}</p>
                  </div>
                  <div
                    className={`toggle-switch ${notifications[item.key] ? 'on' : ''}`}
                    onClick={() => handleNotifChange(item.key)}
                  >
                    <div className="toggle-knob" />
                  </div>
                </div>
              ))}
            </div>

            {/* Danger Zone Card */}
            <div className="settings-card settings-card-danger">
              <h4 className="settings-card-title danger">
                <i className="fa-solid fa-triangle-exclamation"></i> Danger Zone
              </h4>

              <p className="settings-danger-text">
                Permanently delete your account and all associated data.
                This action <strong>cannot be undone</strong>.
              </p>

              {!showConfirm ? (
                <button
                  className="settings-delete-btn"
                  onClick={() => setShowConfirm(true)}
                >
                  <i className="fa-solid fa-trash"></i> Delete Account
                </button>
              ) : (
                <div className="settings-confirm-box">
                  <p className="settings-confirm-text">
                    <i className="fa-solid fa-triangle-exclamation"></i>
                    Are you absolutely sure?
                  </p>
                  <div className="settings-confirm-btns">
                    <button
                      className="settings-confirm-yes"
                      onClick={handleDeleteAccount}
                      disabled={loading}
                    >
                      {loading
                        ? <><i className="fa-solid fa-spinner fa-spin"></i> Deleting...</>
                        : 'Yes, Delete My Account'
                      }
                    </button>
                    <button
                      className="settings-confirm-no"
                      onClick={() => setShowConfirm(false)}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

export default Settings;
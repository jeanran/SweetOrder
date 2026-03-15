import React, { useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import '../styles/Homepage.css';

function Homepage() {
  const [scrolled, setScrolled]         = useState(false);
  const [user, setUser]                 = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef                     = useRef(null);
  const navigate                        = useNavigate();

  useEffect(() => {
    document.body.classList.add('page-loaded');

    // ✅ load user from localStorage
    const stored = localStorage.getItem('user');
    if (stored) {
      const parsedUser = JSON.parse(stored);
      setUser(parsedUser);
      // ensure userId is also stored
      if (!localStorage.getItem('userId')) {
        localStorage.setItem('userId', parsedUser.user_id);
      }
    }

    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);

    // ✅ close dropdown when clicking outside
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
  }, []);

  const handleLogout = async () => {
    try {
      await api.post('/auth/logout/', {}, { withCredentials: true });
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      localStorage.removeItem('user');
      localStorage.removeItem('userId');
      setUser(null); // ✅ clear user state
      setDropdownOpen(false);
      navigate('/login');
    }
  };

  // ✅ get initials for avatar (e.g. "Shella Mae" → "SM")
  const getInitials = (name) => {
    if (!name) return '?';
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <>
      {/* NAVBAR */}
      <header className={`navbar ${scrolled ? 'scrolled' : ''}`}>
        <div className="container nav-container">

          <div className="logo">
            <img className="logo-img" src="/assets/logos.png" alt="SweetOrder logo" />
          </div>

          <nav className="nav-links">
            <Link to="/homepage" className="nav-link">Home</Link>
            <Link to="/about" className="nav-link">About</Link>
            <Link to="/products" className="nav-link">Cakes</Link>
            <Link to="/testimonials" className="nav-link">Testimonials</Link>
            <Link to="/contacts" className="nav-link">Contacts</Link>
          </nav>

          <div className="nav-right">
            {/* CART ICON */}
            <Link to="/cart">
              <img className="cart-icon" src="/assets/cart.png" alt="Cart" />
            </Link>

            {/* ✅ PROFILE DROPDOWN */}
            {user ? (
              <div className="profile-wrapper" ref={dropdownRef}>

                {/* Avatar button */}
                <button
                  className="profile-avatar"
                  onClick={() => setDropdownOpen(prev => !prev)}
                  title={user.name}
                >
                  {getInitials(user.name)}
                </button>

                {/* Dropdown menu */}
                {dropdownOpen && (
                  <div className="profile-dropdown">

                    {/* User info header */}
                    <div className="dropdown-header">
                      <div className="dropdown-avatar">{getInitials(user.name)}</div>
                      <div>
                        <p className="dropdown-name">{user.name}</p>
                        <p className="dropdown-email">{user.email}</p>
                      </div>
                    </div>

                    <hr className="dropdown-divider" />

                    <Link
                      to="/profile"
                      className="dropdown-item"
                      onClick={() => setDropdownOpen(false)}
                    >
                      <i className="fa-solid fa-user"></i> My Profile
                    </Link>

                    <Link
                      to="/orders"
                      className="dropdown-item"
                      onClick={() => setDropdownOpen(false)}
                    >
                      <i className="fa-solid fa-box"></i> My Orders
                    </Link>

                    <Link
                      to="/settings"
                      className="dropdown-item"
                      onClick={() => setDropdownOpen(false)}
                    >
                      <i className="fa-solid fa-gear"></i> Settings
                    </Link>

                    <hr className="dropdown-divider" />

                    <button
                      className="dropdown-item dropdown-logout"
                      onClick={handleLogout}
                    >
                      <i className="fa-solid fa-right-from-bracket"></i> Logout
                    </button>

                  </div>
                )}
              </div>

            ) : (
              // ✅ show Login button if not logged in
              <Link to="/login" className="nav-login-btn">
                Login
              </Link>
            )}

          </div>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="hero">
        <div className="container hero-container">

          <div className="hero-text">
            <h1>Freshly Baked Cakes</h1>
            <h2>Made With Love</h2>
            <p>Order delicious cakes for birthdays, weddings, and special occasions.</p>

            <div className="hero-buttons">
              <Link to="/products">
                <button className="order-btn">Order Now</button>
              </Link>
              
            </div>
          </div>

          <div className="hero-image">
            <img src="/assets/cake.png" alt="Cake" />
          </div>

        </div>
      </section>
    </>
  );
}

export default Homepage;
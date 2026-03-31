import React, { useEffect, useState, useRef } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import api from '../services/api';
import '../styles/Homepage.css';

function Homepage() {
  const navigate                        = useNavigate();
  const dropdownRef                     = useRef(null);
  const [scrolled, setScrolled]         = useState(false);
  const [user, setUser]                 = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Nunito:wght@400;700;800&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);

    document.body.classList.add('page-loaded');
    document.body.style.overflow = 'hidden'; 
    document.body.classList.add('homepage');  

    const stored = localStorage.getItem('user');
    if (stored) {
      const parsedUser = JSON.parse(stored);
      setUser(parsedUser);
      if (!localStorage.getItem('userId')) {
        localStorage.setItem('userId', parsedUser.user_id);
      }
    }

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
      document.body.style.overflow = ''; 
      document.body.classList.remove('homepage');  
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await api.post('/auth/logout/');
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      localStorage.removeItem('user');
      localStorage.removeItem('userId');
      setUser(null);
      setDropdownOpen(false);
      navigate('/login');
    }
  };

  const getInitials = (name) => {
    if (!name) return '?';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <>
      {/* ── NAVBAR ─────────────────────────────────── */}
      <header className={`navbar ${scrolled ? 'scrolled' : ''}`}>
        <div className="container nav-container">

          <div className="logo">
            <img className="logo-img" src="/assets/logos.png" alt="SweetOrder logo" />
          </div>

          <nav className="nav-links">
            <NavLink to="/homepage"     className="nav-link">Home</NavLink>
            <NavLink to="/about"        className="nav-link">About</NavLink>
            <NavLink to="/products"     className="nav-link">Cakes</NavLink>
            <NavLink to="/testimonials" className="nav-link">Testimonials</NavLink>
            <NavLink to="/contacts"     className="nav-link">Contacts</NavLink>
          </nav>

          <div className="nav-right">
            <NavLink to="/cart">
              <img className="cart-icon" src="/assets/cart.png" alt="Cart" />
            </NavLink>

            {user ? (
              <div className="nav-profile-wrapper" ref={dropdownRef}>
                <button
                  className="nav-profile-avatar"
                  onClick={() => setDropdownOpen(prev => !prev)}
                  title={user.name}
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

                    <NavLink to="/profile"  className="dropdown-item" onClick={() => setDropdownOpen(false)}>
                      <i className="fa-solid fa-user" /> My Profile
                    </NavLink>
                    <NavLink to="/orders"   className="dropdown-item" onClick={() => setDropdownOpen(false)}>
                      <i className="fa-solid fa-box" /> My Orders
                    </NavLink>
                    <NavLink to="/settings" className="dropdown-item" onClick={() => setDropdownOpen(false)}>
                      <i className="fa-solid fa-gear" /> Settings
                    </NavLink>

                    <hr className="dropdown-divider" />

                    <button className="dropdown-item dropdown-logout" onClick={handleLogout}>
                      <i className="fa-solid fa-right-from-bracket" /> Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <NavLink to="/login" className="nav-login-btn">Login</NavLink>
            )}
          </div>

        </div>
      </header>

      {/* ── HERO ───────────────────────────────────── */}
      <section className="hero">
        <div className="hero-bg">
          <div className="hero-content">
            <div className="hero-text-card">

              <div className="hero-left">
                <h1>Freshly Baked Cakes</h1>
                <h2>Made With Love</h2>
                <p>Order delicious cakes for birthdays, weddings, and special occasions.</p>
                <div className="hero-buttons">
                  <NavLink to="/order" className="order-btn-home">Order Now</NavLink>
                  <NavLink to="/products" className="view-btn-home">View Cakes</NavLink>
                </div>
              </div>

              <div className="home-cake-image">
                <img src="/assets/cake.png" alt="Freshly baked cake" />
              </div>

            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default Homepage;
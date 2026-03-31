import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import '../styles/About.css';

function About() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    document.body.classList.add('page-loaded');

    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);

    return () => {
      document.body.classList.remove('page-loaded');
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <>
      {/* ── NAVBAR ───────────────────────────────────── */}
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
          </div>
        </div>
      </header>

      {/* ── ABOUT SECTION ────────────────────────────── */}
      <section className="about-section" id="about">
        <h1 className="about-title">About Us</h1>

        <div className="about-container">
          <div className="about-img">
            <img src="/assets/about-us-image.jpg" alt="About SweetOrder" />
          </div>
          <div className="about-content">
            <p className="about-tag">Welcome to SweetOrder</p>
            <h2>Freshly Baked Cakes Made With Love</h2>
            <p className="about-text">
              At SweetOrder, every cake is crafted with passion and high-quality
              ingredients. Whether it's birthdays, weddings, or special celebrations,
              our bakery creates memorable desserts that make every moment sweeter.
            </p>
            <NavLink to="/products" className="about-btn">Explore Cakes</NavLink>
          </div>
        </div>

        {/* ── STATS ──────────────────────────────────── */}
        <div className="about-stats">
          <div className="stat">
            <h3>10+</h3>
            <p>Years Baking</p>
          </div>
          <div className="stat">
            <h3>3,500+</h3>
            <p>Cakes Delivered</p>
          </div>
          <div className="stat">
            <h3>1,200+</h3>
            <p>Happy Customers</p>
          </div>
        </div>
      </section>

      {/* ── CUSTOM CAKE SECTION ──────────────────────── */}
      <section className="custom-cake">
        <div className="custom-container">
          <div className="custom-text">
            <h2>Order a Custom Cake</h2>
            <p>
              Looking for something unique? Tell us your dream cake design and
              our bakers will create the perfect cake for your celebration.
              Birthdays, weddings, anniversaries, and more!
            </p>
            <NavLink to="/contacts" className="custom-btn">Request Custom Cake</NavLink>
          </div>
          <div className="custom-image">
            <img src="/assets/about-us-image.jpg" alt="Custom Cake" />
          </div>
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────── */}
      <footer className="footer">
        <div className="footer-container">

          <div className="footer-brand">
            <img src="/assets/logos.png" className="footer-logo" alt="SweetOrder" />
            <p>
              SweetOrder creates delicious cakes for birthdays, weddings,
              and special celebrations. Every cake is baked with love.
            </p>
          </div>

          <div className="footer-links">
            <h4>Quick Links</h4>
            <NavLink to="/homepage">Home</NavLink>
            <NavLink to="/about">About</NavLink>
            <NavLink to="/products">Cakes</NavLink>
            <NavLink to="/testimonials">Testimonials</NavLink>
            <NavLink to="/contacts">Contact</NavLink>
          </div>

          <div className="footer-contact">
            <h4>Contact</h4>
            <p>Email: sweetorder@gmail.com</p>
            <p>Phone: +63 912 345 6789</p>
            <p>Location: Cagayan de Oro, Philippines</p>
          </div>

        </div>
        <div className="footer-bottom">
          <p>© 2026 SweetOrder Bakery. All rights reserved.</p>
        </div>
      </footer>
    </>
  );
}

export default About;
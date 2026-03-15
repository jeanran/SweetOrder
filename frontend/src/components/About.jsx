import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
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
            <Link to="/products" className="about-btn">Explore Cakes</Link>
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
            <Link to="/contacts" className="custom-btn">Request Custom Cake</Link>
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
            <Link to="/homepage">Home</Link>
            <Link to="/about">About</Link>
            <Link to="/products">Cakes</Link>
            <Link to="/testimonials">Testimonials</Link>
            <Link to="/contacts">Contact</Link>
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
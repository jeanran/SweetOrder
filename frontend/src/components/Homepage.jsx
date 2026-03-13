import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Homepage.css';

function Homepage() {
  // State for navbar scroll effect
  const [scrolled, setScrolled] = useState(false);

  // Effect for body opacity and scroll listener
  useEffect(() => {
    // Add the page-loaded class to body when component mounts
    document.body.classList.add('page-loaded');
    
    // Scroll event listener for navbar
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    
    // Clean up when component unmounts
    return () => {
      document.body.classList.remove('page-loaded');
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
return (
    <>
      {/*NAVIGATION BAR with scroll effect*/}
      <header className={`navbar ${scrolled ? 'scrolled' : ''}`}>
        <div className="container nav-container">
          <div className="logo">
            <img className="logo-img" src="/assets/logos.png" alt="sweetorder logo" />
          </div>

          <nav className="nav-links">
            <Link to="/homepage" className="nav-link">Home</Link>
            <Link to="/about" className="nav-link">About</Link>
            <Link to="/products" className="nav-link">Cakes</Link>
            <Link to="/testimonials" className="nav-link">Testimonials</Link>
            <Link to="/contacts" className="nav-link">Contacts</Link>
          </nav>

          <div className="nav-right">
            <Link to="/cart"><img className="cart-icon" src="/assets/cart.png" alt="cart icon" /></Link>
          </div>
        </div>
      </header>

      {/*HERO SECTION*/}
      <section className="hero">
        <div className="container hero-container">
          <div className="hero-text">
            <h1>Freshly Baked Cakes</h1>
            <h2>Made With Love</h2>
            <p>
              Order delicious cakes for birthdays,
              weddings, and special occasions.
            </p>
            <div className="hero-buttons">
              <Link to="/login"><button className="order-btn">Order Now</button></Link>
              <a href="#best-sellers"><button className="view-btn">View Cakes</button></a>
            </div>
          </div>

          <div className="hero-image">
            <img src="/assets/cake.png" alt="Cake" />
          </div>
        </div>
      </section>
</>
)}
export default Homepage;
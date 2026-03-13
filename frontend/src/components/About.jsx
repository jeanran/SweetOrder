import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/About.css';

function About() {
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

      {/*ABOUT ME SECTION*/}
      <section className="about-section" id="about">
        <h1 className="title">ABOUT US</h1>
        <div className="about-container">
          <div className="about-img">
            <img src="/assets/about-us-image.jpg" alt="About Image" />
          </div>
          <div className="about-content">
            <p>WELCOME TO SWEETORDER</p>
            <h2>Freshly Baked Cookies Made With Love</h2>
            <p className="about-text">
              At SweetOrder, every cake is crafted with passion and high-quality ingredients.
              Whether it's birthdays, weddings, or special celebrations, our bakery creates
              memorable desserts that make every moment sweeter.
            </p>
            <a href="#best-sellers" className="about-btn">Explore Cakes</a>
          </div>
        </div>

        {/* ABOUT STATS */}
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

      {/*ORDER CUSTOMIZE CAKE*/}
      <section className="custom-cake">
        <div className="custom-container">
          <div className="custom-text">
            <h2>Order a Custom Cake</h2>
            <p>
              Looking for something unique? Tell us your dream cake design and
              our bakers will create the perfect cake for your celebration.
              Birthdays, weddings, anniversaries, and more!
            </p>
            <a href="#contact" className="custom-btn">Request Custom Cake</a>
          </div>
          <div className="custom-image">
            <img src="/assets/about-us-image.jpg" alt="Custom Cake" />
          </div>
        </div>
      </section>

      <footer className="footer">
        <div className="footer-container">
          {/* BRAND */}
          <div className="footer-brand">
            <img src="/assets/logos.png" className="footer-logo" alt="SweetOrder" />
            <p>
              SweetOrder creates delicious cakes for birthdays, weddings,
              and special celebrations. Every cake is baked with love.
            </p>
          </div>

          {/* QUICK LINKS */}
          <div className="footer-links">
            <h4>Quick Links</h4>
            <a href="#home">Home</a>
            <a href="#about">About</a>
            <a href="#best-sellers">Cakes</a>
            <a href="#testimonials">Testimonials</a>
            <a href="#contact">Contact</a>
          </div>

          {/* CONTACT */}
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
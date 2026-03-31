import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import '../styles/Testimonials.css';

function Testimonials() {
  // State for navbar scroll effect
  const [scrolled, setScrolled] = useState(false);

  
  useEffect(() => {
    
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
            <NavLink to="/homepage" className="nav-link">Home</NavLink>
            <NavLink to="/about" className="nav-link">About</NavLink>
            <NavLink to="/products" className="nav-link">Cakes</NavLink>
            <NavLink to="/testimonials" className="nav-link">Testimonials</NavLink>
            <NavLink to="/contacts" className="nav-link">Contacts</NavLink>
          </nav>

          <div className="nav-right">
            <NavLink to="/cart">
              <img className="cart-icon" src="/assets/cart.png" alt="cart icon" />
            </NavLink>
          </div>
        </div>
      </header>

      
      {/*TESTIMONIALS SECTION*/}
      <section className="testimonial-section" id="testimonials">
        <div className="testimonial-header">
          <p className="testimonial-subtitle">Testimonials</p>
          <h2>Sweet Moments From Our Customers</h2>
        </div>

        <div className="testimonial-container">
          {/* TESTIMONIAL 1 */}
          <div className="testimonial-card">
            <span className="quote">“</span>
            <p>Ordering a cake was so easy! The website was simple to use, and the cake arrived exactly as I requested. It looked beautiful and tasted even better. My daughter absolutely loved it!</p>
            <div className="testimonial-user">
              <img src="/assets/account.png" alt="customer" />
              <div>
                <h4>Maria Santos</h4>
                <p>@mariasweets</p>
              </div>
            </div>
          </div>

          {/* TESTIMONIAL 2 */}
          <div className="testimonial-card">
            <span className="quote">“</span>
            <p>The cake was absolutely beautiful and delicious! SweetOrder made our wedding day even more special. The customization options were great and everything arrived on time.</p>
            <div className="testimonial-user">
              <img src="/assets/account.png" alt="customer" />
              <div>
                <h4>Daniel Cruz</h4>
                <p>@danielcelebrates</p>
              </div>
            </div>
          </div>

          {/*TESTIMONIAL 3*/}
          <div className="testimonial-card">
            <span className="quote">“</span>
            <p>I've ordered multiple cakes for birthdays and family events, and every time the quality is amazing. The designs are stunning and the flavors are incredible!</p>
            <div className="testimonial-user">
              <img src="/assets/account.png" alt="customer" />
              <div>
                <h4>Aisha Khan</h4>
                <p>@aishabakesfan</p>
              </div>
            </div>
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

export default Testimonials;
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Contacts.css';

function Contacts() {
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

  // Function for thumbnail gallery
  const changeImage = (event, productCard) => {
    const mainImage = productCard.querySelector('.mainImage');
    const thumbnails = productCard.querySelectorAll('.thumb');
    
    // Update main image
    mainImage.src = event.target.src;
    
    // Update active class on thumbnails
    thumbnails.forEach(thumb => thumb.classList.remove('active'));
    event.target.classList.add('active');
  };

  // Function for product scroll
  const scrollProducts = (direction) => {
    const scrollContainer = document.getElementById('productScroll');
    const scrollAmount = 400;
    
    if (direction === 'left') {
      scrollContainer.scrollLeft -= scrollAmount;
    } else {
      scrollContainer.scrollLeft += scrollAmount;
    }
  };

  // Add click handlers to thumbnails after component mounts
  useEffect(() => {
    // Get all product cards
    const productCards = document.querySelectorAll('.product-card');
    
    // Add click event to all thumbnails
    productCards.forEach(card => {
      const thumbs = card.querySelectorAll('.thumb');
      thumbs.forEach(thumb => {
        thumb.addEventListener('click', (e) => changeImage(e, card));
      });
    });

    // Clean up event listeners
    return () => {
      productCards.forEach(card => {
        const thumbs = card.querySelectorAll('.thumb');
        thumbs.forEach(thumb => {
          thumb.removeEventListener('click', (e) => changeImage(e, card));
        });
      });
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

      {/*CONTACT INFO SECTION*/}
      <section className="contact-section" id="contact">
        <div className="contact-container">
          <div className="contact-image">
            <img src="/assets/about-us-image.jpg" alt="Bakery Interior" />
          </div>

          <div className="contact-content">
            <h2>Contact SweetOrder</h2>
            <p className="contact-description">
              Have questions or want to order a custom cake?
              Reach out to our bakery and we'll be happy to help make your celebration special.
            </p>

            <div className="contact-info">
              <div>
                <h4>Bakery Hours</h4>
                <p>Monday – Saturday</p>
                <p>9:00 AM – 6:00 PM</p>
              </div>

              <div>
                <h4>Contact</h4>
                <p>sweetorder@email.com</p>
                <p>+63 912 345 6789</p>
              </div>
            </div>

            <form className="contact-form">
              <input type="text" placeholder="Full Name" required />
              <input type="email" placeholder="Email Address" required />
              <textarea placeholder="Your Message" rows="4"></textarea>
              <button type="submit">Send Message</button>
            </form>
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

export default Contacts;
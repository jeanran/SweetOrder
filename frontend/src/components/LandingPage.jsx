import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/landing_page.css';

function LandingPage() {
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
            <a href="#home" className="nav-link">Home</a>
            <a href="#about" className="nav-link">About</a>
            <a href="#best-sellers" className="nav-link">Cakes</a>
            <a href="#testimonials" className="nav-link">Testimonials</a>
            <a href="#contact" className="nav-link">Contacts</a>
          </nav>

          <div className="nav-right">
            <Link to="/cart"><img className="cart-icon" src="/assets/cart.png" alt="cart icon" /></Link>
            <Link to="/login"><button className="login-button">Log In</button></Link>
          </div>
        </div>
      </header>

      {/*HERO SECTION*/}
      <section className="hero" id="home">
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

      {/*ABOUT ME SECTION*/}
      <section className="about-section" id="about">
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

      {/*PRODUCT SUMMARY with scroll buttons*/}
      <section className="products" id="best-sellers">
        <h2 className="section-title">BEST SELLERS</h2>
        <div className="products-wrapper">
          <button className="scroll-btn left" onClick={() => scrollProducts('left')}>&#10094;</button>
          
          {/* PRODUCT 1 */}
          <div className="products-scroll" id="productScroll">
            <div className="product-card">
              <div className="product-gallery">
                <div className="main-image">
                  <img src="/assets/3layer_weddingcake.jpg" className="mainImage" alt="" />
                </div>
                <div className="thumbnails">
                  <img src="/assets/3layer_weddingcake_1.jpg" className="thumb active" alt="" />
                  <img src="/assets/3layer_weddingcake_2.jpg" className="thumb" alt="" />
                  <img src="/assets/3layer_weddingcake_3.jpg" className="thumb" alt="" />
                  <img src="/assets/3layer_weddingcake_4.jpg" className="thumb" alt="" />
                  <img src="/assets/3layer_weddingcake_5.jpg" className="thumb" alt="" />
                  <img src="/assets/3layer_weddingcake_6.jpg" className="thumb" alt="" />
                </div>
              </div>
              <h3>Wedding Cake</h3>
              <p className="desc">Elegant 3-layer wedding cake with floral design</p>
              <p className="price">$35.00</p>
            </div>

            {/* PRODUCT 2 */}
            <div className="product-card">
              <div className="product-gallery">
                <div className="main-image">
                  <img src="/assets/birthdaycake.jpg" className="mainImage" alt="" />
                </div>
                <div className="thumbnails">
                  <img src="/assets/birthdaycake_1.jpg" className="thumb active" alt="" />
                  <img src="/assets/birthdaycake_2.jpg" className="thumb" alt="" />
                  <img src="/assets/birthdaycake_3.jpg" className="thumb" alt="" />
                  <img src="/assets/birthdaycake_4.jpg" className="thumb" alt="" />
                  <img src="/assets/birthdaycake_5.jpg" className="thumb" alt="" />
                  <img src="/assets/birthdaycake_6.jpg" className="thumb" alt="" />
                </div>
              </div>
              <h3>Birthday Cake</h3>
              <p className="desc">Colorful birthday cake with sprinkles</p>
              <p className="price">$32.00</p>
            </div>

            {/* PRODUCT 3 */}
            <div className="product-card">
              <div className="product-gallery">
                <div className="main-image">
                  <img src="/assets/men-birthdaycake.jpg" className="mainImage" alt="" />
                </div>
                <div className="thumbnails">
                  <img src="/assets/men-birthdaycake_1.jpg" className="thumb active" alt="" />
                  <img src="/assets/men-birthdaycake_2.jpg" className="thumb" alt="" />
                  <img src="/assets/men-birthdaycake_3.jpg" className="thumb" alt="" />
                  <img src="/assets/men-birthdaycake_4.jpg" className="thumb" alt="" />
                  <img src="/assets/men-birthdaycake_5.jpg" className="thumb" alt="" />
                  <img src="/assets/men-birthdaycake_6.jpg" className="thumb" alt="" />
                </div>
              </div>
              <h3>Men's Birthday Cake</h3>
              <p className="desc">Classic design perfect for him</p>
              <p className="price">$40.00</p>
            </div>

            {/* PRODUCT 4 */}
            <div className="product-card">
              <div className="product-gallery">
                <div className="main-image">
                  <img src="/assets/anniversarycake.jpg" className="mainImage" alt="" />
                </div>
                <div className="thumbnails">
                  <img src="/assets/anniversarycake_1.jpg" className="thumb active" alt="" />
                  <img src="/assets/anniversarycake_2.jpg" className="thumb" alt="" />
                  <img src="/assets/anniversarycake_3.jpg" className="thumb" alt="" />
                  <img src="/assets/anniversarycake_4.jpg" className="thumb" alt="" />
                  <img src="/assets/anniversarycake_5.jpg" className="thumb" alt="" />
                  <img src="/assets/anniversarycake_6.jpg" className="thumb" alt="" />
                </div>
              </div>
              <h3>Anniversary Cake</h3>
              <p className="desc">Romantic cake for special moments</p>
              <p className="price">$40.00</p>
            </div>
          </div>

          <div className="button-products">
            <Link to="/products" className="viewproducts-btn">View Products</Link>
          </div>
          
          <button className="scroll-btn right" onClick={() => scrollProducts('right')}>&#10095;</button>
        </div>
      </section>

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

export default LandingPage;
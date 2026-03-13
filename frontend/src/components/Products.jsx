import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/Products.css";

function Products() {
  const [showCart, setShowCart] = useState(false);
  const [cartItem, setCartItem] = useState({});
  const navigate = useNavigate();
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
  

  const products = [
    {
      name: "Strawberry Dream Cake",
      price: "$18.00",
      category: "wedding",
      image: "../assets/3layer_weddingcake.jpg",
      info: "A delicious strawberry cake perfect for any celebration."
    },
    {
      name: "Chocolate Delight",
      price: "$20.00",
      category: "birthday",
      image: "../assets/men-birthdaycake_6.jpg"
    },
    {
      name: "Wedding Vanilla Cake",
      price: "$45.00",
      category: "anniversary",
      image: "../assets/men-birthdaycake_6.jpg"
    },
    {
      name: "Chocolate Delight",
      price: "$20.00",
      category: "anniversary",
      image: "../assets/men-birthdaycake_6.jpg"
    },
    {
      name: "Wedding Vanilla Cake",
      price: "$45.00",
      category: "wedding",
      image: "../assets/men-birthdaycake_6.jpg"
    },
      {
      name: "Strawberry Dream Cake",
      price: "$18.00",
      category: "wedding",
      image: "../assets/3layer_weddingcake.jpg",
      info: "A delicious strawberry cake perfect for any celebration."
    },
    {
      name: "Chocolate Delight",
      price: "$20.00",
      category: "birthday",
      image: "../assets/men-birthdaycake_6.jpg"
    },
    {
      name: "Wedding Vanilla Cake",
      price: "$45.00",
      category: "anniversary",
      image: "../assets/men-birthdaycake_6.jpg"
    },
    {
      name: "Chocolate Delight",
      price: "$20.00",
      category: "anniversary",
      image: "../assets/men-birthdaycake_6.jpg"
    },
    {
      name: "Wedding Vanilla Cake",
      price: "$45.00",
      category: "wedding",
      image: "../assets/men-birthdaycake_6.jpg"
    }
  ];

  const handleAddCart = (product) => {
    setCartItem(product);
    setShowCart(true);
  };

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
    <h1 className="title">Our Cakes</h1>
      {/* SHOP CONTROLS */}
      <section className="shop-controls">
        <div className="controls-container">

          <input
            type="text"
            placeholder="Search cakes..."
            className="search-bar"
          />

          <select className="category-filter">
            <option value="">All Cakes</option>
            <option value="birthday">Birthday Cakes</option>
            <option value="wedding">Wedding Cakes</option>
            <option value="cupcake">Cupcakes</option>
            <option value="custom">Custom Cakes</option>
          </select>

        </div>
      </section>

      {/* PRODUCTS */}
      <section >

        <div className="product-grid">

          {products.map((product, index) => (
            <div className="product-card" key={index}>
              <img className="product-img" src={product.image} alt={product.name} />

              <h3 className="product-name">{product.name}</h3>

              {product.info && (
                <p className="product-info">{product.info}</p>
              )}

              <p className="product-price">{product.price}</p>

              <button
                className="add-cart"
                onClick={() => handleAddCart(product)}
              >
                Add to Cart
              </button>
            </div>
          ))}

        </div>
      </section>

      {/* CART MODAL */}
      <div className={`cart-overlay ${showCart ? "active" : ""}`}>
        <div className="cart-modal">

          <h2>Item Added to Cart</h2>

          <div className="cart-item">
            <img src={cartItem.image} alt={cartItem.name} />

            <div className="cart-info">
              <h3>{cartItem.name}</h3>
              <p>{cartItem.price}</p>
            </div>
          </div>

          <div className="cart-actions">
            <button
              className="continue-btn"
              onClick={() => setShowCart(false)}
            >
              Continue Shopping
            </button>

            <button
              className="checkout-btn"
              onClick={() => navigate("/cart")}
            >
              Go To Cart
            </button>
          </div>

        </div>
      </div>
    </>
  );
}

export default Products;
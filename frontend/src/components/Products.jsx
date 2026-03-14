import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import "../styles/Products.css";

function Products() {
  const [showCart, setShowCart]     = useState(false);
  const [cartItem, setCartItem]     = useState({});
  const [products, setProducts]     = useState([]);   // ✅ from API, not hardcoded
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState("");
  const [search, setSearch]         = useState("");
  const [category, setCategory]     = useState("");
  const [cartLoading, setCartLoading] = useState(false);
  const [scrolled, setScrolled]     = useState(false);
  const navigate = useNavigate();


  
 

  // ─── SCROLL LISTENER ───────────────────────────────────────
  useEffect(() => {
    document.body.classList.add('page-loaded');

    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);

    return () => {
      document.body.classList.remove('page-loaded');
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // ─── FETCH PRODUCTS FROM DJANGO ────────────────────────────
useEffect(() => {
  const fetchProducts = async () => {
    if (products.length === 0) setLoading(true);  // ✅ only spinner when empty
    setError("");

    try {
      const response = await api.get('/products/', {
        params: {
          search:   search   || undefined,
          category: category || undefined,
        }
      });
      setProducts(response.data);
      setLoading(false);          // ✅ here, not in finally

    } catch (err) {
      console.error('Failed to fetch products:', err);
      setError("Failed to load products. Make sure Django is running.");
      setLoading(false);
    }
  };

  const delay = setTimeout(fetchProducts, 400);  // ✅ debounce
  return () => clearTimeout(delay);              // ✅ cleanup

}, [search, category]);                          // ✅ re-fetch when these change
  

  // ─── ADD TO CART ───────────────────────────────────────────
  const handleAddCart = async (product) => {
  const user = localStorage.getItem('user');
  if (!user) {
    navigate('/login');
    return;
  }

  const userData = JSON.parse(user);
  setCartLoading(true);

  try {
    await api.post('/cart/', {
      product_id: product.product_id,
      quantity:   1,
      user_id:    userData.user_id    // ✅ send this so Django knows who it is
    });

    setCartItem(product);
    setShowCart(true);

  } catch (err) {
    console.error('Add to cart error:', err);
    if (err.response?.data?.error) {
      alert(err.response.data.error);
    } else {
      alert('Failed to add to cart. Please try again.');
    }
  } finally {
    setCartLoading(false);
  }
};


  // ─── RENDER ────────────────────────────────────────────────
  return (
    <>
      {/* NAVBAR */}
      <header className={`navbar ${scrolled ? 'scrolled' : ''}`}>
        <div className="container nav-container">
          <div className="logo">
            <img className="logo-img" src="/assets/logos.png" alt="sweetorder logo" />
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
              <img className="cart-icon" src="/assets/cart.png" alt="cart icon" />
            </Link>
          </div>
        </div>
      </header>

      <h1 className="title">Our Cakes</h1>

      {/* SEARCH & FILTER */}
      <section className="shop-controls">
        <div className="controls-container">
          <input
            type="text"
            placeholder="Search cakes..."
            className="search-bar"
            value={search}
            onChange={(e) => setSearch(e.target.value)}  // ✅ triggers API re-fetch
          />
          <select
            className="category-filter"
            value={category}
            onChange={(e) => setCategory(e.target.value)} // ✅ triggers API re-fetch
          >
            <option value="">All Cakes</option>
            <option value="birthday">Birthday Cakes</option>
            <option value="wedding">Wedding Cakes</option>
            <option value="anniversary">Anniversary Cakes</option>
            <option value="cupcake">Cupcakes</option>
            <option value="custom">Custom Cakes</option>
          </select>
        </div>
      </section>

      {/* PRODUCTS GRID */}
      <section>
        {/* Loading state */}
        {loading && (
          <div className="loading-container" style={{ textAlign: 'center', padding: '60px' }}>
            <i className="fa-solid fa-spinner fa-spin" style={{ fontSize: '2rem' }}></i>
            <p>Loading cakes...</p>
          </div>
        )}

        {/* Error state */}
        {!loading && error && (
          <div style={{ textAlign: 'center', padding: '60px', color: '#c62828' }}>
            <i className="fa-solid fa-exclamation-circle"></i> {error}
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && products.length === 0 && (
          <div style={{ textAlign: 'center', padding: '60px', color: '#888' }}>
            <i className="fa-solid fa-cake-candles" style={{ fontSize: '2rem' }}></i>
            <p>No cakes found.</p>
          </div>
        )}

        {/* Products */}
        {!loading && !error && products.length > 0 && (
          <div className="product-grid">
            {products.map((product) => (
              <div className="product-card" key={product.product_id}>
                <img
                  className="product-img"
                  src={product.image_url || '/assets/placeholder.jpg'}
                  alt={product.product_name}
                  onError={(e) => { e.target.src = '/assets/placeholder.jpg'; }}
                />
                <h3 className="product-name">{product.product_name}</h3>

                {product.description && (
                  <p className="product-info">{product.description}</p>
                )}

                <p className="product-price">₱{parseFloat(product.price).toFixed(2)}</p>

                {/* ✅ show out of stock if stock is 0 */}
                {product.stock === 0 ? (
                  <button className="add-cart" disabled style={{ opacity: 0.5, cursor: 'not-allowed' }}>
                    Out of Stock
                  </button>
                ) : (
                  <button
                    className="add-cart"
                    onClick={() => handleAddCart(product)}
                    disabled={cartLoading}
                  >
                    {cartLoading ? (
                      <i className="fa-solid fa-spinner fa-spin"></i>
                    ) : (
                      'Add to Cart'
                    )}
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </section>

      {/* CART MODAL */}
      <div className={`cart-overlay ${showCart ? "active" : ""}`}>
        <div className="cart-modal">
          <h2>Item Added to Cart</h2>

          <div className="cart-item">
            <img
              src={cartItem.image_url || '/assets/placeholder.jpg'}
              alt={cartItem.product_name}
            />
            <div className="cart-info">
              <h3>{cartItem.product_name}</h3>
              <p>₱{cartItem.price ? parseFloat(cartItem.price).toFixed(2) : ''}</p>
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
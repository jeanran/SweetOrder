import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import api from "../services/api";
import "../styles/Products.css";

function Products() {
  const navigate                        = useNavigate();
  const [products, setProducts]         = useState([]);
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState("");
  const [search, setSearch]             = useState("");
  const [category, setCategory]         = useState("");
  const [scrolled, setScrolled]         = useState(false);
  const [cartLoading, setCartLoading]   = useState(false);

  // ── VIEW MODAL ───────────────────────────────────────
  const [viewProduct, setViewProduct]   = useState(null);

  // ── CART SUCCESS MODAL ───────────────────────────────
  const [showCart, setShowCart]         = useState(false);
  const [cartItem, setCartItem]         = useState({});

  // ── SCROLL ───────────────────────────────────────────
  useEffect(() => {
    document.body.classList.add('page-loaded');
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => {
      document.body.classList.remove('page-loaded');
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // ── FETCH PRODUCTS ───────────────────────────────────
  useEffect(() => {
    const fetchProducts = async () => {
      if (products.length === 0) setLoading(true);
      setError("");
      try {
        const response = await api.get('/products/', {
          params: {
            search:   search   || undefined,
            category: category || undefined,
          }
        });
        setProducts(response.data);
      } catch (err) {
        console.error('Failed to fetch products:', err);
        setError("Failed to load products. Make sure Django is running.");
      } finally {
        setLoading(false);
      }
    };
    const delay = setTimeout(fetchProducts, 400);
    return () => clearTimeout(delay);
  }, [search, category]);

  // ── ADD TO CART ──────────────────────────────────────
  const handleAddCart = async (product) => {
    const user = localStorage.getItem('user');
    if (!user) { navigate('/login'); return; }

    setCartLoading(true);
    try {
      await api.post('/cart/', {
        product_id: product.product_id,
        quantity:   1,
        user_id:    JSON.parse(user).user_id,
      });
      setCartItem(product);
      setViewProduct(null);   // ✅ close view modal
      setShowCart(true);      // ✅ show success modal
    } catch (err) {
      console.error('Add to cart error:', err);
      alert(err.response?.data?.error || 'Failed to add to cart. Please try again.');
    } finally {
      setCartLoading(false);
    }
  };

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

      {/* ── TITLE ────────────────────────────────────── */}
      <h1 className="title">Our Cakes</h1>

      {/* ── SEARCH & FILTER ──────────────────────────── */}
      <section className="shop-controls">
        <div className="controls-container">
          <input
            type="text"
            placeholder="Search cakes..."
            className="search-bar"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select
            className="category-filter"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
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

      {/* ── PRODUCTS GRID ────────────────────────────── */}
      <section>
        {loading && (
          <div className="state-container">
            <i className="fa-solid fa-spinner fa-spin fa-2x"></i>
            <p>Loading cakes...</p>
          </div>
        )}

        {!loading && error && (
          <div className="state-container state-error">
            <i className="fa-solid fa-exclamation-circle fa-2x"></i>
            <p>{error}</p>
          </div>
        )}

        {!loading && !error && products.length === 0 && (
          <div className="state-container">
            <i className="fa-solid fa-cake-candles fa-2x"></i>
            <p>No cakes found.</p>
          </div>
        )}

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

                <p className="product-price">
                  ₱{parseFloat(product.price).toFixed(2)}
                </p>

                {/* ✅ Two buttons — View and Add to Cart */}
                {product.stock === 0 ? (
                  <button className="add-cart" disabled>Out of Stock</button>
                ) : (
                  <div className="product-btns">
                    <button
                      className="view-product-btn"
                      onClick={() => setViewProduct(product)}
                    >
                      <i className="fa-solid fa-eye"></i> View
                    </button>
                    <button
                      className="add-cart"
                      onClick={() => handleAddCart(product)}
                      disabled={cartLoading}
                    >
                      {cartLoading
                        ? <i className="fa-solid fa-spinner fa-spin"></i>
                        : <><i className="fa-solid fa-cart-plus"></i> Add</>
                      }
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ── VIEW PRODUCT MODAL ───────────────────────── */}
      {viewProduct && (
        <div className="cart-overlay active" onClick={() => setViewProduct(null)}>
          <div className="view-modal" onClick={(e) => e.stopPropagation()}>

            <button className="view-modal-close" onClick={() => setViewProduct(null)}>
              <i className="fa-solid fa-xmark"></i>
            </button>

            <div className="view-modal-body">

              {/* Image */}
              <div className="view-modal-img-wrapper">
                <img
                  src={viewProduct.image_url || '/assets/placeholder.jpg'}
                  alt={viewProduct.product_name}
                  onError={(e) => { e.target.src = '/assets/placeholder.jpg'; }}
                />
              </div>

              {/* Details */}
              <div className="view-modal-details">
                <span className="view-modal-category">
                  {viewProduct.category}
                </span>

                <h2 className="view-modal-title">{viewProduct.product_name}</h2>

                <p className="view-modal-price">
                  ₱{parseFloat(viewProduct.price).toFixed(2)}
                </p>

                <p className="view-modal-desc">
                  {viewProduct.description || 'No description available.'}
                </p>

                <div className="view-modal-stock">
                  <i className="fa-solid fa-box"></i>
                  {viewProduct.stock > 0
                    ? `${viewProduct.stock} available`
                    : 'Out of stock'
                  }
                </div>

                {/* ✅ Two action buttons */}
                <div className="view-modal-actions">
                  <button
                    className="view-add-cart-btn"
                    onClick={() => handleAddCart(viewProduct)}
                    disabled={cartLoading || viewProduct.stock === 0}
                  >
                    {cartLoading
                      ? <><i className="fa-solid fa-spinner fa-spin"></i> Adding...</>
                      : <><i className="fa-solid fa-cart-plus"></i> Add to Cart</>
                    }
                  </button>
                  <button
                    className="view-cancel-btn"
                    onClick={() => setViewProduct(null)}
                  >
                    Continue Shopping
                  </button>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* ── CART SUCCESS MODAL ───────────────────────── */}
      <div className={`cart-overlay ${showCart ? "active" : ""}`}>
        <div className="cart-modal">
          <h2>Item Added to Cart 🎉</h2>

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
            <button className="continue-btn" onClick={() => setShowCart(false)}>
              Continue Shopping
            </button>
            <button className="checkout-btn" onClick={() => navigate("/cart")}>
              Go To Cart
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default Products;
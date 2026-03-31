import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import '../styles/cart.css';

function Cart() {
  const navigate                    = useNavigate();
  const [cartItems, setCartItems]   = useState([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState('');
  const deliveryFee                 = 50;

  useEffect(() => {
    document.body.classList.add('page-loaded');
    fetchCart();
    return () => document.body.classList.remove('page-loaded');
  }, []);

  // ── FETCH CART ───────────────────────────────────────
  const fetchCart = async () => {
    const userId = localStorage.getItem('userId');
    if (!userId) { navigate('/login'); return; }

    try {
      const response = await api.get(`/cart/?user_id=${userId}`);
      const data     = Array.isArray(response.data)
        ? response.data
        : response.data.results || [];
      setCartItems(data);
    } catch (err) {
      console.error('Error fetching cart:', err);
      setError('Failed to load cart.');
    } finally {
      setLoading(false);
    }
  };

  // ── SUBTOTAL ─────────────────────────────────────────
  const subtotal = cartItems.reduce(
    (sum, item) => sum + (parseFloat(item.price || 0) * item.quantity), 0
  );

  // ── UPDATE QUANTITY ──────────────────────────────────
  const updateQuantity = async (cartId, newQuantity) => {
    if (newQuantity < 1) return;
    const userId = localStorage.getItem('userId');
    try {
      await api.patch(`/cart/${cartId}/`, { quantity: newQuantity, user_id: userId });
      setCartItems(prev =>
        prev.map(item =>
          item.cart_id === cartId ? { ...item, quantity: newQuantity } : item
        )
      );
    } catch (err) {
      console.error('Error updating quantity:', err);
    }
  };

  // ── REMOVE ITEM ──────────────────────────────────────
  const removeItem = async (cartId) => {
    const userId = localStorage.getItem('userId');
    try {
      await api.delete(`/cart/${cartId}/`, { data: { user_id: userId } });
      setCartItems(prev => prev.filter(item => item.cart_id !== cartId));
    } catch (err) {
      console.error('Error removing item:', err);
    }
  };

  return (
    <div className="cart-page">

      {/* ── HEADER ───────────────────────────────────── */}
      <div className="cart-header">
        <button className="back-button" onClick={() => navigate(-1)}>
          <i className="fa-solid fa-arrow-left"></i> Back
        </button>
        <h1 className="cart-title">My Cart</h1>
        <span className="cart-count">
          {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'}
        </span>
      </div>

      <div className="cart-container">

        {/* ── LEFT — CART ITEMS ────────────────────── */}
        <div className="cart-items">

          {loading && (
            <div className="cart-state">
              <i className="fa-solid fa-spinner fa-spin fa-2x"></i>
              <p>Loading your cart...</p>
            </div>
          )}

          {!loading && error && (
            <div className="cart-state cart-state-error">
              <i className="fa-solid fa-exclamation-circle fa-2x"></i>
              <p>{error}</p>
            </div>
          )}

          {!loading && !error && cartItems.length === 0 && (
            <div className="empty-cart">
              <i className="fa-solid fa-bag-shopping"></i>
              <h3>Your cart is empty</h3>
              <p>Looks like you haven't added any cakes yet.</p>
              <Link to="/products" className="continue-shopping">
                Browse Cakes
              </Link>
            </div>
          )}

          {!loading && !error && cartItems.map(item => (
            <div key={item.cart_id} className="cart-card">

              {/* Image + Info */}
              <div className="cart-product">
                <img
                  src={item.image_url || '/assets/placeholder.jpg'}
                  alt={item.product_name}
                  className="cart-img"
                  onError={(e) => { e.target.src = '/assets/placeholder.jpg'; }}
                />
                <div className="cart-product-info">
                  <h4>{item.product_name}</h4>
                  <p className="cart-unit-price">
                    ₱{parseFloat(item.price).toFixed(2)} each
                  </p>
                </div>
              </div>

              {/* Quantity */}
              <div className="cart-qty">
                <button onClick={() => updateQuantity(item.cart_id, item.quantity - 1)}>
                  −
                </button>
                <span>{item.quantity}</span>
                <button onClick={() => updateQuantity(item.cart_id, item.quantity + 1)}>
                  +
                </button>
              </div>

              {/* Subtotal */}
              <div className="cart-price">
                ₱{(parseFloat(item.price) * item.quantity).toFixed(2)}
              </div>

              {/* Remove */}
              <button className="cart-remove" onClick={() => removeItem(item.cart_id)}>
                <i className="fa-solid fa-trash"></i>
              </button>

            </div>
          ))}

        </div>

        {/* ── RIGHT — ORDER SUMMARY ─────────────────── */}
        <div className="cart-summary">
          <h3>Order Summary</h3>

          <div className="summary-rows">
            <div className="summary-row">
              <span>Subtotal ({cartItems.length} items)</span>
              <span>₱{subtotal.toFixed(2)}</span>
            </div>
            <div className="summary-row">
              <span>Delivery Fee</span>
              <span>₱{deliveryFee.toFixed(2)}</span>
            </div>
          </div>

          <div className="summary-total">
            <span>Total</span>
            <span>₱{(subtotal + deliveryFee).toFixed(2)}</span>
          </div>

          <button
  className="checkout-btn"
  disabled={cartItems.length === 0}
  onClick={() => navigate('/checkout')}
>
  <i className="fa-solid fa-bag-shopping"></i> Checkout Now
</button>


          <Link to="/products" className="continue-link">
            ← Continue Shopping
          </Link>
        </div>

      </div>
    </div>
  );
}

export default Cart;
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';   // ✅ use api.js not raw fetch
import '../styles/cart.css';

function Cart() {
  const navigate = useNavigate();

  const [cartItems, setCartItems]   = useState([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState('');
  const deliveryFee = 50;

  useEffect(() => {
    document.body.classList.add('page-loaded');
    fetchCart();
    return () => document.body.classList.remove('page-loaded');
  }, []);

  // ─── FETCH CART ──────────────────────────────────────────
  const fetchCart = async () => {
    const userId = localStorage.getItem('userId');
    console.log('User ID:', userId);

    if (!userId) {
      navigate('/login');
      return;
    }

    try {
      // ✅ pass user_id as query param since sessions are unreliable in dev
      const response = await api.get(`/cart/?user_id=${userId}`);

      // ✅ FIXED: Django returns {results: [...]} from ViewSet OR just array
      const data = Array.isArray(response.data)
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

  // ─── SUBTOTAL ────────────────────────────────────────────
  const subtotal = cartItems.reduce((sum, item) => {
    // ✅ FIXED: use item.price (from CartSerializer) not item.product.price
    // because CartSerializer flattens product fields
    return sum + (parseFloat(item.price || 0) * item.quantity);
  }, 0);

  // ─── UPDATE QUANTITY ─────────────────────────────────────
  const updateQuantity = async (cartId, newQuantity) => {
    if (newQuantity < 1) return;
    const userId = localStorage.getItem('userId');

    try {
        await api.patch(`/cart/${cartId}/`, {
            quantity: newQuantity,
            user_id:  userId        // ✅ send user_id
        });
        // ✅ update state directly, no re-fetch needed
        setCartItems(prev =>
            prev.map(item =>
                item.cart_id === cartId
                    ? { ...item, quantity: newQuantity }
                    : item
            )
        );
    } catch (err) {
        console.error('Error updating quantity:', err);
    }
};

const removeItem = async (cartId) => {
    const userId = localStorage.getItem('userId');

    try {
        await api.delete(`/cart/${cartId}/`, {
            data: { user_id: userId }   // ✅ axios needs 'data' key for DELETE body
        });
        setCartItems(prev => prev.filter(item => item.cart_id !== cartId));
    } catch (err) {
        console.error('Error removing item:', err);
    }
};
  
  // ─── RENDER ──────────────────────────────────────────────
  return (
    <div className="cart-page">
      <button className="back-button" onClick={() => navigate(-1)}>
        <i className="fa-solid fa-arrow-left"></i> Back
      </button>

      <div className="cart-container">
        <div className="cart-items">

          {loading && (
            <div style={{ textAlign: 'center', padding: '40px' }}>
              <i className="fa-solid fa-spinner fa-spin"></i> Loading cart...
            </div>
          )}

          {!loading && error && (
            <div style={{ color: '#c62828', textAlign: 'center', padding: '40px' }}>
              {error}
            </div>
          )}

          {!loading && !error && cartItems.length === 0 && (
            <div className="empty-cart">
              <h3>Your cart is empty</h3>
              <Link to="/products" className="continue-shopping">
                Continue Shopping
              </Link>
            </div>
          )}

          {!loading && cartItems.map(item => (
            <div key={item.cart_id} className="cart-card">

              <div className="cart-product">
                <img
                  // ✅ FIXED: use item.image_url (from CartSerializer)
                  // not item.product.image (product is flattened)
                  src={item.image_url || '/assets/placeholder.jpg'}
                  alt={item.product_name}
                  className="cart-img"
                  onError={(e) => { e.target.src = '/assets/placeholder.jpg'; }}
                />
                <div>
                  <h4>{item.product_name}</h4>
                  <p>₱{parseFloat(item.price).toFixed(2)}</p>
                </div>
              </div>

              <div className="cart-qty">
                <button onClick={() => updateQuantity(item.cart_id, item.quantity - 1)}>
                  −
                </button>
                <span>{item.quantity}</span>
                <button onClick={() => updateQuantity(item.cart_id, item.quantity + 1)}>
                  +
                </button>
              </div>

              <div className="cart-price">
                ₱{(parseFloat(item.price) * item.quantity).toFixed(2)}
              </div>

              <button
                className="cart-remove"
                onClick={() => removeItem(item.cart_id)}
              >
                <i className="fa-solid fa-trash"></i>
              </button>

            </div>
          ))}

        </div>

        {/* ORDER SUMMARY */}
        <div className="cart-summary">
          <h3>Order Summary</h3>

          <div className="summary-row">
            <span>Subtotal</span>
            <span>₱{subtotal.toFixed(2)}</span>
          </div>

          <div className="summary-row">
            <span>Delivery</span>
            <span>₱{deliveryFee.toFixed(2)}</span>
          </div>

          <div className="summary-row total">
            <span>Total</span>
            <span>₱{(subtotal + deliveryFee).toFixed(2)}</span>
          </div>

          <Link to="/checkout">
            <button className="checkout-btn">Checkout Now</button>
          </Link>
        </div>

      </div>
    </div>
  );
}

export default Cart;
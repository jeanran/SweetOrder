import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';        // ✅ use api.js not raw fetch
import '../styles/checkout.css';

function Checkout() {
  const navigate = useNavigate();

  const [cartItems, setCartItems]   = useState([]);
  const [loading, setLoading]       = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError]           = useState('');

  const [formData, setFormData] = useState({
    fullName:      '',
    email:         '',
    phone:         '',
    address:       '',
    paymentMethod: 'cash'
  });

  const deliveryFee = 50;

  // ─── ON MOUNT ───────────────────────────────────────────────
  useEffect(() => {
    document.body.classList.add('page-loaded');

    // ✅ redirect if not logged in
    const user = localStorage.getItem('user');
    if (!user) {
      navigate('/login');
      return;
    }

    // ✅ pre-fill name and email from localStorage
    const userData = JSON.parse(user);
    setFormData(prev => ({
      ...prev,
      fullName: userData.name  || '',
      email:    userData.email || '',
    }));

    fetchCart();

    return () => document.body.classList.remove('page-loaded');
  }, [navigate]);

  // ─── FETCH REAL CART FROM DJANGO ────────────────────────────
  const fetchCart = async () => {
    const userId = localStorage.getItem('userId');
    try {
      const response = await api.get(`/cart/?user_id=${userId}`);
      const data = Array.isArray(response.data)
        ? response.data
        : response.data.results || [];
      setCartItems(data);
    } catch (err) {
      console.error('Failed to fetch cart:', err);
      setError('Failed to load cart items.');
    } finally {
      setLoading(false);
    }
  };

  // ─── TOTALS ─────────────────────────────────────────────────
  const subtotal = cartItems.reduce(
    (sum, item) => sum + (parseFloat(item.price || 0) * item.quantity), 0
  );
  const total = subtotal + deliveryFee;

  // ─── FORM HANDLERS ──────────────────────────────────────────
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePaymentChange = (e) => {
    setFormData(prev => ({ ...prev, paymentMethod: e.target.value }));
  };

  // ─── SUBMIT ORDER ───────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    const userId = localStorage.getItem('userId');

    if (!userId) {
      navigate('/login');
      return;
    }

    if (cartItems.length === 0) {
      setError('Your cart is empty.');
      setSubmitting(false);
      return;
    }

    try {
      // ✅ use api.js, send user_id + address
      const response = await api.post('/checkout/', {
        user_id:          userId,
        delivery_address: formData.address,
      });

      if (response.status === 201) {
        alert(`Order #${response.data.order_id} placed successfully! Total: ₱${response.data.total}`);
        navigate('/products');
      }

    } catch (err) {
      console.error('Checkout error:', err);
      if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else {
        setError('Failed to place order. Please try again.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  // ─── RENDER ─────────────────────────────────────────────────
  return (
    <section className="checkout-page">

      <button className="back-button" onClick={() => navigate(-1)}>
        <i className="fa-solid fa-arrow-left"></i> Back
      </button>

      <h1 className="checkout-title">Checkout</h1>

      {error && (
        <div style={{
          background: '#ffebee', color: '#c62828',
          padding: '12px', borderRadius: '8px',
          margin: '0 auto 20px', maxWidth: '800px',
          border: '1px solid #ffcdd2', textAlign: 'center'
        }}>
          <i className="fa-solid fa-exclamation-circle"></i> {error}
        </div>
      )}

      <div className="checkout-container">

        {/* LEFT — FORM */}
        <div className="checkout-form">
          <h2>Customer Information</h2>

          <form onSubmit={handleSubmit}>

            <div className="form-group">
              <label>Full Name</label>
              <input
                type="text"
                name="fullName"
                placeholder="Enter your full name"
                value={formData.fullName}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Email Address</label>
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Phone Number</label>
              <input
                type="text"
                name="phone"
                placeholder="Enter your phone number"
                value={formData.phone}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Delivery Address</label>
              <textarea
                name="address"
                placeholder="Enter your delivery address"
                value={formData.address}
                onChange={handleInputChange}
                required
              />
            </div>

            <h3 className="payment-title">Payment Method</h3>

            <div className="payment-methods">
              <label className="payment-option">
                <input
                  type="radio"
                  name="payment"
                  value="cash"
                  checked={formData.paymentMethod === 'cash'}
                  onChange={handlePaymentChange}
                />
                <span>Cash on Delivery</span>
              </label>

              <label className="payment-option">
                <input
                  type="radio"
                  name="payment"
                  value="card"
                  checked={formData.paymentMethod === 'card'}
                  onChange={handlePaymentChange}
                />
                <span>Credit / Debit Card</span>
              </label>
            </div>

            <button
              type="submit"
              className="place-order"
              disabled={submitting || cartItems.length === 0}
              style={{ opacity: submitting ? 0.7 : 1 }}
            >
              {submitting ? (
                <><i className="fa-solid fa-spinner fa-spin"></i> Placing Order...</>
              ) : (
                'Place Order'
              )}
            </button>

          </form>
        </div>

        {/* RIGHT — ORDER SUMMARY */}
        <div className="order-summary">
          <h3>Order Summary</h3>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '20px' }}>
              <i className="fa-solid fa-spinner fa-spin"></i> Loading...
            </div>
          ) : cartItems.length === 0 ? (
            <div style={{ textAlign: 'center', color: '#888', padding: '20px' }}>
              Your cart is empty.
            </div>
          ) : (
            <div className="checkout-items">
              {cartItems.map(item => (
                <div key={item.cart_id} className="checkout-item">
                  <div className="checkout-item-info">
                    {/* ✅ use product_name from CartSerializer */}
                    <span className="item-name">{item.product_name}</span>
                    <span className="item-qty">x{item.quantity}</span>
                  </div>
                  <span className="item-price">
                    ₱{(parseFloat(item.price) * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          )}

          <hr />

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
            <span>₱{total.toFixed(2)}</span>
          </div>

          <Link to="/cart" className="back-to-cart">
            ← Back to Cart
          </Link>
        </div>

      </div>
    </section>
  );
}

export default Checkout;
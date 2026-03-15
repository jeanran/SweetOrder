import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import '../styles/checkout.css';

function Checkout() {
  const navigate                    = useNavigate();
  const [cartItems, setCartItems]   = useState([]);
  const [loading, setLoading]       = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError]           = useState('');
  const deliveryFee                 = 50;

  const [formData, setFormData] = useState({
    fullName: '', email: '', phone: '', address: '', paymentMethod: 'cash'
  });

  useEffect(() => {
    document.body.classList.add('page-loaded');
    const user = localStorage.getItem('user');
    if (!user) { navigate('/login'); return; }
    const u = JSON.parse(user);
    setFormData(prev => ({ ...prev, fullName: u.name || '', email: u.email || '' }));
    fetchCart();
    return () => document.body.classList.remove('page-loaded');
  }, [navigate]);

  const fetchCart = async () => {
    try {
      const res  = await api.get(`/cart/?user_id=${localStorage.getItem('userId')}`);
      const data = Array.isArray(res.data) ? res.data : res.data.results || [];
      setCartItems(data);
    } catch { setError('Failed to load cart items.'); }
    finally  { setLoading(false); }
  };

  const subtotal = cartItems.reduce((sum, i) => sum + parseFloat(i.price || 0) * i.quantity, 0);
  const total    = subtotal + deliveryFee;

  const handleInput   = (e) => setFormData(p => ({ ...p, [e.target.name]: e.target.value }));
  const handlePayment = (e) => setFormData(p => ({ ...p, paymentMethod: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (cartItems.length === 0) { setError('Your cart is empty.'); return; }
    setSubmitting(true);
    setError('');
    try {
      const res = await api.post('/checkout/', {
        user_id:          localStorage.getItem('userId'),
        delivery_address: formData.address,
      });
      if (res.status === 201) {
        alert(`Order #${res.data.order_id} placed! Total: ₱${res.data.total}`);
        navigate('/orders');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to place order. Please try again.');
    } finally { setSubmitting(false); }
  };

  const fields = [
    { label: 'Full Name',     name: 'fullName', type: 'text',  placeholder: 'Enter your full name' },
    { label: 'Email Address', name: 'email',    type: 'email', placeholder: 'Enter your email' },
    { label: 'Phone Number',  name: 'phone',    type: 'text',  placeholder: 'Enter your phone number' },
  ];

  const payments = [
    { value: 'cash', icon: 'fa-money-bill-wave', label: 'Cash on Delivery' },
    { value: 'card', icon: 'fa-credit-card',     label: 'Credit / Debit Card' },
  ];

  return (
    <section className="checkout-page">

      <button className="back-button" onClick={() => navigate(-1)}>
        <i className="fa-solid fa-arrow-left"></i> Back
      </button>

      <h1 className="checkout-title">Checkout</h1>

      {error && (
        <div className="checkout-error">
          <i className="fa-solid fa-exclamation-circle"></i> {error}
        </div>
      )}

      <div className="checkout-container">

        {/* ── FORM ─────────────────────────────────── */}
        <div className="checkout-form">
          <h2>Customer Information</h2>
          <form onSubmit={handleSubmit}>

            {fields.map(f => (
              <div className="form-group" key={f.name}>
                <label>{f.label}</label>
                <input
                  type={f.type} name={f.name}
                  placeholder={f.placeholder}
                  value={formData[f.name]}
                  onChange={handleInput} required
                />
              </div>
            ))}

            <div className="form-group">
              <label>Delivery Address</label>
              <textarea
                name="address"
                placeholder="Enter your delivery address"
                value={formData.address}
                onChange={handleInput} required
              />
            </div>

            <h3 className="payment-title">Payment Method</h3>
            <div className="payment-methods">
              {payments.map(p => (
                <label className="payment-option" key={p.value}>
                  <input
                    type="radio" name="payment" value={p.value}
                    checked={formData.paymentMethod === p.value}
                    onChange={handlePayment}
                  />
                  <i className={`fa-solid ${p.icon}`}></i>
                  <span>{p.label}</span>
                </label>
              ))}
            </div>

            <button type="submit" className="place-order"
              disabled={submitting || cartItems.length === 0}>
              {submitting
                ? <><i className="fa-solid fa-spinner fa-spin"></i> Placing Order...</>
                : <><i className="fa-solid fa-bag-shopping"></i> Place Order</>}
            </button>

          </form>
        </div>

        {/* ── ORDER SUMMARY ────────────────────────── */}
        <div className="order-summary">
          <h3>Order Summary</h3>

          {loading ? (
            <div className="summary-state">
              <i className="fa-solid fa-spinner fa-spin"></i>
              <p>Loading...</p>
            </div>
          ) : cartItems.length === 0 ? (
            <div className="summary-state">
              <i className="fa-solid fa-bag-shopping"></i>
              <p>Your cart is empty.</p>
            </div>
          ) : (
            <div className="checkout-items">
              {cartItems.map(item => (
                <div key={item.cart_id} className="checkout-item">
                  <div className="checkout-item-info">
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

          <div className="summary-rows">
            <div className="summary-row"><span>Subtotal</span><span>₱{subtotal.toFixed(2)}</span></div>
            <div className="summary-row"><span>Delivery Fee</span><span>₱{deliveryFee.toFixed(2)}</span></div>
          </div>

          <div className="summary-total">
            <span>Total</span>
            <span>₱{total.toFixed(2)}</span>
          </div>

          <Link to="/cart" className="back-to-cart">← Back to Cart</Link>
        </div>

      </div>
    </section>
  );
}

export default Checkout;
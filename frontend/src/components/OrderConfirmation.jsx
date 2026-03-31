import React, { useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import '../styles/OrderConfirmation.css';

function OrderConfirmation() {
  const navigate  = useNavigate();
  const location  = useLocation();
  const { orderId, total, items } = location.state || {};

  useEffect(() => {
    document.body.classList.add('page-loaded');
    // ✅ if no order data, redirect to products
    if (!orderId) { navigate('/products'); return; }
    return () => document.body.classList.remove('page-loaded');
  }, [orderId, navigate]);

  return (
    <div className="confirm-page">

      {/* ── CONFETTI HEADER ──────────────────────── */}
      <div className="confirm-card">

        {/* Icon */}
        <div className="confirm-icon">🎉</div>

        <h1 className="confirm-title">Order Placed!</h1>
        <p className="confirm-subtitle">
          Thank you for your order. We'll start preparing your cake right away!
        </p>

        {/* Order ID */}
        <div className="confirm-order-id">
          <span>Order ID</span>
          <strong>#{orderId}</strong>
        </div>

        {/* Items */}
        {items && items.length > 0 && (
          <div className="confirm-items">
            <h4>Items Ordered</h4>
            {items.map((item, i) => (
              <div key={i} className="confirm-item">
                <div className="confirm-item-left">
                  <span className="confirm-item-dot"></span>
                  <span className="confirm-item-name">{item.product_name}</span>
                  <span className="confirm-item-qty">×{item.quantity}</span>
                </div>
                <span className="confirm-item-price">
                  ₱{(parseFloat(item.price) * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Total */}
        <div className="confirm-total">
          <span>Total Paid</span>
          <span className="confirm-total-amount">₱{parseFloat(total).toFixed(2)}</span>
        </div>

        {/* Status */}
        <div className="confirm-status">
          <i className="fa-solid fa-clock"></i>
          Your order is <strong>pending</strong> — we'll update you soon!
        </div>

        {/* Actions */}
        <div className="confirm-actions">
          <Link to="/orders" className="confirm-btn-primary">
            <i className="fa-solid fa-box"></i> View My Orders
          </Link>
          <Link to="/products" className="confirm-btn-secondary">
            <i className="fa-solid fa-cake-candles"></i> Continue Shopping
          </Link>
        </div>

      </div>
    </div>
  );
}

export default OrderConfirmation;
import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import '../styles/Orders.css';

function Orders() {
  const navigate                        = useNavigate();
  const dropdownRef                     = useRef(null);
  const [orders, setOrders]             = useState([]);
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState('');
  const [user, setUser]                 = useState(null);
  const [scrolled, setScrolled]         = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    document.body.classList.add('page-loaded');

    const stored = localStorage.getItem('user');
    if (!stored) { navigate('/login'); return; }
    setUser(JSON.parse(stored));

    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);

    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);

    fetchOrders();

    return () => {
      document.body.classList.remove('page-loaded');
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [navigate]);

  const fetchOrders = async () => {
    const stored = localStorage.getItem('user');
    if (!stored) return setError('Please login.');
    const userId = JSON.parse(stored).user_id;
    try {
      const response = await api.get(`/orders/?user_id=${userId}`);
      const data     = Array.isArray(response.data)
        ? response.data
        : response.data.results || [];
      setOrders(data);
    } catch (err) {
      console.error(err);
      setError('Failed to load orders.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try { await api.post('/auth/logout/'); } catch (e) {}
    localStorage.removeItem('user');
    localStorage.removeItem('userId');
    navigate('/login');
  };

  const getInitials = (name) => {
    if (!name) return '?';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const statusConfig = (status) => {
    const map = {
      pending:    { bg: '#fff8e1', color: '#f59e0b', icon: 'fa-clock' },
      processing: { bg: '#e3f2fd', color: '#1976d2', icon: 'fa-gear' },
      shipped:    { bg: '#e8eaf6', color: '#5c6bc0', icon: 'fa-truck' },
      delivered:  { bg: '#e8f5e9', color: '#2e7d32', icon: 'fa-check-circle' },
      cancelled:  { bg: '#ffebee', color: '#c62828', icon: 'fa-xmark' },
    };
    return map[status] || { bg: '#f5f5f5', color: '#666', icon: 'fa-circle' };
  };

  return (
    <div className="orders-page">

      {/* ── NAVBAR ───────────────────────────────────── */}
      <header className={`navbar ${scrolled ? 'scrolled' : ''}`}>
        <div className="container nav-container">
          <div className="logo">
            <img className="logo-img" src="/assets/logos.png" alt="SweetOrder logo" />
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
              <img className="cart-icon" src="/assets/cart.png" alt="Cart" />
            </Link>
            {user && (
              <div className="nav-profile-wrapper" ref={dropdownRef}>
                <button
                  className="nav-profile-avatar"
                  onClick={() => setDropdownOpen(p => !p)}
                >
                  {getInitials(user.name)}
                </button>
                {dropdownOpen && (
                  <div className="profile-dropdown">
                    <div className="dropdown-header">
                      <div className="dropdown-avatar">{getInitials(user.name)}</div>
                      <div>
                        <p className="dropdown-name">{user.name}</p>
                        <p className="dropdown-email">{user.email}</p>
                      </div>
                    </div>
                    <hr className="dropdown-divider" />
                    <Link to="/profile"  className="dropdown-item" onClick={() => setDropdownOpen(false)}>
                      <i className="fa-solid fa-user"></i> My Profile
                    </Link>
                    <Link to="/orders"   className="dropdown-item" onClick={() => setDropdownOpen(false)}>
                      <i className="fa-solid fa-box"></i> My Orders
                    </Link>
                    <Link to="/settings" className="dropdown-item" onClick={() => setDropdownOpen(false)}>
                      <i className="fa-solid fa-gear"></i> Settings
                    </Link>
                    <hr className="dropdown-divider" />
                    <button className="dropdown-item dropdown-logout" onClick={handleLogout}>
                      <i className="fa-solid fa-right-from-bracket"></i> Logout
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </header>

      {/* ── PAGE TITLE BANNER ────────────────────────── */}
      <div className="orders-title-banner">
        <div className="orders-title-inner">
          <i className="fa-solid fa-box orders-title-icon"></i>
          <div>
            <h1 className="orders-title-text">MY ORDERS</h1>
            <p className="orders-title-sub">Track and review all your sweet purchases</p>
          </div>
        </div>
      </div>

      {/* ── CONTENT ──────────────────────────────────── */}
      <div className="orders-content">

        {/* Sub heading with count */}
        <div className="orders-heading">
          {!loading && !error && orders.length > 0 && (
            <span className="orders-badge">
              {orders.length} {orders.length === 1 ? 'Order' : 'Orders'}
            </span>
          )}
        </div>

        {/* Loading */}
        {loading && (
          <div className="orders-state">
            <i className="fa-solid fa-spinner fa-spin fa-2x"></i>
            <p>Loading your orders...</p>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="orders-state orders-state-error">
            <i className="fa-solid fa-exclamation-circle fa-2x"></i>
            <p>{error}</p>
          </div>
        )}

        {/* Empty */}
        {!loading && !error && orders.length === 0 && (
          <div className="orders-empty">
            <i className="fa-solid fa-box-open"></i>
            <h3>No orders yet</h3>
            <p>Looks like you haven't ordered anything yet.</p>
            <button className="orders-shop-btn" onClick={() => navigate('/products')}>
              <i className="fa-solid fa-cake-candles"></i> Shop Now
            </button>
          </div>
        )}

        {/* Order Cards */}
        {!loading && !error && orders.length > 0 && (
          <div className="orders-grid">
            {orders.map(order => {
              const sc = statusConfig(order.status);
              return (
                <div key={order.order_id} className="order-card">

                  {/* Card Header */}
                  <div className="order-card-header">
                    <div>
                      <p className="order-id">Order #{order.order_id}</p>
                      <p className="order-date">
                        <i className="fa-regular fa-calendar"></i>
                        {new Date(order.order_date).toLocaleDateString('en-PH', {
                          year: 'numeric', month: 'long', day: 'numeric'
                        })}
                      </p>
                    </div>
                    <span className="order-status" style={{ background: sc.bg, color: sc.color }}>
                      <i className={`fa-solid ${sc.icon}`}></i>
                      {order.status}
                    </span>
                  </div>

                  {/* Order Items */}
                  <div className="order-items">
                    {order.order_details?.length > 0 ? (
                      order.order_details.map(item => (
                        <div key={item.order_detail_id} className="order-item">
                          <div className="order-item-left">
                            <span className="order-item-dot"></span>
                            <span className="order-item-name">{item.product_name}</span>
                            <span className="order-item-qty">x{item.quantity}</span>
                          </div>
                          <span className="order-item-price">
                            P{parseFloat(item.subtotal).toFixed(2)}
                          </span>
                        </div>
                      ))
                    ) : (
                      <p className="order-no-items">No items found.</p>
                    )}
                  </div>

                  {/* Card Footer */}
                  <div className="order-card-footer">
                    <p className="order-address">
                      <i className="fa-solid fa-location-dot"></i>
                      <span>{order.delivery_address}</span>
                    </p>
                    <div className="order-total-row">
                      <span>Total Amount</span>
                      <span className="order-total">
                        P{parseFloat(order.total_amount).toFixed(2)}
                      </span>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
}

export default Orders;
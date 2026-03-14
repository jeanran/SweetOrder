import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';

function Orders() {
  const navigate              = useNavigate();
  const [orders, setOrders]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState('');

  useEffect(() => {
    document.body.classList.add('page-loaded');     // ✅ fix blank page

    const storedUser = localStorage.getItem('user');
    if (!storedUser) { navigate('/login'); return; }

    fetchOrders();

    return () => document.body.classList.remove('page-loaded');
  }, [navigate]);

  const fetchOrders = async () => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) return setError('Please login.');

    const userId = JSON.parse(storedUser).user_id;

    try {
      const response = await api.get(`/orders/?user_id=${userId}`);
      const data = Array.isArray(response.data)
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
    <div style={{ minHeight: '100vh', background: '#fdf6f8' }}>

      {/* ✅ NAVBAR */}
      <header style={{
        background: '#fff', padding: '14px 28px',
        display: 'flex', alignItems: 'center',
        justifyContent: 'space-between',
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
        position: 'sticky', top: 0, zIndex: 100
      }}>
        <button onClick={() => navigate(-1)} style={{
          background: 'none', border: 'none', cursor: 'pointer',
          display: 'flex', alignItems: 'center', gap: '6px',
          color: '#c0607a', fontSize: '14px', fontWeight: '500'
        }}>
          <i className="fa-solid fa-arrow-left"></i> Back
        </button>
        <span style={{ fontWeight: '600', color: '#333', fontSize: '16px' }}>
          My Orders
        </span>
        <Link to="/cart" style={{ color: '#c0607a', fontSize: '18px' }}>
          <i className="fa-solid fa-cart-shopping"></i>
        </Link>
      </header>

      {/* ✅ RESPONSIVE CONTAINER */}
      <div style={{
        maxWidth: '900px',
        margin: '0 auto',
        padding: '32px 16px',
        boxSizing: 'border-box',
        width: '100%',
      }}>

        {/* Summary bar */}
        {!loading && !error && orders.length > 0 && (
          <div style={{
            display: 'flex', alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '24px'
          }}>
            <h2 style={{ margin: 0, color: '#333', fontSize: '20px' }}>
              My Orders
            </h2>
            <span style={{
              background: '#f4c2ce', color: '#c0607a',
              padding: '4px 14px', borderRadius: '20px',
              fontSize: '13px', fontWeight: '600'
            }}>
              {orders.length} {orders.length === 1 ? 'Order' : 'Orders'}
            </span>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div style={{ textAlign: 'center', padding: '80px 20px', color: '#888' }}>
            <i className="fa-solid fa-spinner fa-spin"
               style={{ fontSize: '2rem', color: '#c0607a', marginBottom: '16px', display: 'block' }}></i>
            <p style={{ margin: 0 }}>Loading your orders...</p>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div style={{
            background: '#ffebee', color: '#c62828', padding: '20px',
            borderRadius: '12px', textAlign: 'center'
          }}>
            <i className="fa-solid fa-exclamation-circle"
               style={{ marginRight: '8px' }}></i>
            {error}
          </div>
        )}

        {/* Empty */}
        {!loading && !error && orders.length === 0 && (
          <div style={{ textAlign: 'center', padding: '80px 20px', color: '#888' }}>
            <i className="fa-solid fa-box-open"
               style={{ fontSize: '3rem', color: '#f4c2ce',
                        marginBottom: '16px', display: 'block' }}></i>
            <h3 style={{ margin: '0 0 8px', color: '#555' }}>No orders yet</h3>
            <p style={{ margin: '0 0 20px', fontSize: '14px' }}>
              Looks like you haven't ordered anything yet.
            </p>
            <button
              onClick={() => navigate('/products')}
              style={{
                padding: '12px 28px', background: '#c0607a', color: '#fff',
                border: 'none', borderRadius: '24px', cursor: 'pointer',
                fontSize: '14px', fontWeight: '600'
              }}
            >
              <i className="fa-solid fa-cake-candles"
                 style={{ marginRight: '8px' }}></i>
              Shop Now
            </button>
          </div>
        )}

        {/* ✅ RESPONSIVE ORDER CARDS GRID */}
        {!loading && !error && orders.length > 0 && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))',
            gap: '20px',
          }}>
            {orders.map(order => {
              const sc = statusConfig(order.status);
              return (
                <div key={order.order_id} style={{
                  background: '#fff',
                  borderRadius: '16px',
                  boxShadow: '0 2px 16px rgba(0,0,0,0.07)',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                }}>

                  {/* Card Header */}
                  <div style={{
                    padding: '16px 20px',
                    borderBottom: '1px solid #f5f5f5',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}>
                    <div>
                      <p style={{ margin: 0, fontWeight: '700',
                                  color: '#333', fontSize: '15px' }}>
                        Order #{order.order_id}
                      </p>
                      <p style={{ margin: '3px 0 0', fontSize: '12px', color: '#aaa' }}>
                        <i className="fa-regular fa-calendar"
                           style={{ marginRight: '4px' }}></i>
                        {new Date(order.order_date).toLocaleDateString('en-PH', {
                          year: 'numeric', month: 'long', day: 'numeric'
                        })}
                      </p>
                    </div>
                    {/* Status Badge */}
                    <span style={{
                      padding: '5px 12px', borderRadius: '20px',
                      fontSize: '12px', fontWeight: '600',
                      background: sc.bg, color: sc.color,
                      textTransform: 'capitalize',
                      display: 'flex', alignItems: 'center', gap: '5px'
                    }}>
                      <i className={`fa-solid ${sc.icon}`}></i>
                      {order.status}
                    </span>
                  </div>

                  {/* Order Items */}
                  <div style={{ padding: '12px 20px', flex: 1 }}>
                    {order.order_details?.length > 0 ? (
                      order.order_details.map(item => (
                        <div key={item.order_detail_id} style={{
                          display: 'flex', justifyContent: 'space-between',
                          alignItems: 'center',
                          padding: '8px 0',
                          borderBottom: '1px solid #fafafa',
                          fontSize: '14px', color: '#555'
                        }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <div style={{
                              width: '8px', height: '8px', borderRadius: '50%',
                              background: '#f4c2ce', flexShrink: 0
                            }} />
                            <span>{item.product_name}</span>
                            <span style={{
                              background: '#f5f5f5', color: '#888',
                              padding: '1px 7px', borderRadius: '10px',
                              fontSize: '12px'
                            }}>
                              ×{item.quantity}
                            </span>
                          </div>
                          <span style={{ fontWeight: '500', color: '#333' }}>
                            ₱{parseFloat(item.subtotal).toFixed(2)}
                          </span>
                        </div>
                      ))
                    ) : (
                      <p style={{ color: '#aaa', fontSize: '13px', margin: '8px 0' }}>
                        No items found.
                      </p>
                    )}
                  </div>

                  {/* Card Footer */}
                  <div style={{
                    padding: '14px 20px',
                    background: '#fdf6f8',
                    borderTop: '1px solid #f5f5f5',
                  }}>
                    {/* Delivery address */}
                    <p style={{
                      margin: '0 0 10px', fontSize: '12px',
                      color: '#888', display: 'flex',
                      alignItems: 'flex-start', gap: '6px'
                    }}>
                      <i className="fa-solid fa-location-dot"
                         style={{ color: '#c0607a', marginTop: '2px', flexShrink: 0 }}></i>
                      <span style={{
                        overflow: 'hidden', textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap', maxWidth: '280px'
                      }}>
                        {order.delivery_address}
                      </span>
                    </p>

                    {/* Total */}
                    <div style={{
                      display: 'flex', justifyContent: 'space-between',
                      alignItems: 'center'
                    }}>
                      <span style={{ fontSize: '13px', color: '#888' }}>
                        Total Amount
                      </span>
                      <span style={{
                        fontWeight: '700', color: '#c0607a', fontSize: '16px'
                      }}>
                        ₱{parseFloat(order.total_amount).toFixed(2)}
                      </span>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        )}

        {/* ✅ Bottom padding for mobile */}
        <div style={{ height: '40px' }} />
      </div>
    </div>
  );
}

export default Orders;
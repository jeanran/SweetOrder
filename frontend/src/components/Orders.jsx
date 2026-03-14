import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

function Orders() {
  const navigate        = useNavigate();
  const [orders, setOrders]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState('');

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (!user) { navigate('/login'); return; }
    fetchOrders();
  }, [navigate]);

  const fetchOrders = async () => {
    const userId = localStorage.getItem('userId');
    try {
      const response = await api.get(`/orders/?user_id=${userId}`);
      const data = Array.isArray(response.data)
        ? response.data
        : response.data.results || [];
      setOrders(data);
    } catch (err) {
      setError('Failed to load orders.');
    } finally {
      setLoading(false);
    }
  };

  const statusColor = (status) => {
    const map = {
      pending:    { bg: '#fff8e1', color: '#f59e0b' },
      processing: { bg: '#e3f2fd', color: '#1976d2' },
      shipped:    { bg: '#e8eaf6', color: '#5c6bc0' },
      delivered:  { bg: '#e8f5e9', color: '#2e7d32' },
      cancelled:  { bg: '#ffebee', color: '#c62828' },
    };
    return map[status] || { bg: '#f5f5f5', color: '#666' };
  };

  return (
    <div style={{ minHeight: '100vh', background: '#fdf6f8', padding: '40px 20px' }}>
      <div style={{ maxWidth: '700px', margin: '0 auto' }}>

        <button
          onClick={() => navigate(-1)}
          style={{ background: 'none', border: 'none', cursor: 'pointer',
                   fontSize: '14px', color: '#c0607a', marginBottom: '24px',
                   display: 'flex', alignItems: 'center', gap: '6px' }}
        >
          <i className="fa-solid fa-arrow-left"></i> Back
        </button>

        <h2 style={{ marginBottom: '24px', color: '#333' }}>My Orders</h2>

        {loading && (
          <div style={{ textAlign: 'center', padding: '60px', color: '#888' }}>
            <i className="fa-solid fa-spinner fa-spin fa-2x"></i>
            <p>Loading orders...</p>
          </div>
        )}

        {!loading && error && (
          <div style={{ background: '#ffebee', color: '#c62828', padding: '16px',
                        borderRadius: '10px', textAlign: 'center' }}>
            {error}
          </div>
        )}

        {!loading && !error && orders.length === 0 && (
          <div style={{ textAlign: 'center', padding: '60px', color: '#888' }}>
            <i className="fa-solid fa-box-open fa-3x" style={{ marginBottom: '16px', color: '#ddd' }}></i>
            <p>No orders yet.</p>
            <button
              onClick={() => navigate('/products')}
              style={{ marginTop: '12px', padding: '10px 24px', background: '#c0607a',
                       color: '#fff', border: 'none', borderRadius: '20px', cursor: 'pointer' }}
            >
              Shop Now
            </button>
          </div>
        )}

        {!loading && orders.map(order => {
          const sc = statusColor(order.status);
          return (
            <div key={order.order_id} style={{
              background: '#fff', borderRadius: '14px', padding: '20px',
              marginBottom: '16px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)'
            }}>
              {/* Order Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between',
                            alignItems: 'center', marginBottom: '12px' }}>
                <div>
                  <p style={{ margin: 0, fontWeight: '600', color: '#333' }}>
                    Order #{order.order_id}
                  </p>
                  <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#aaa' }}>
                    {new Date(order.order_date).toLocaleDateString('en-PH', {
                      year: 'numeric', month: 'long', day: 'numeric'
                    })}
                  </p>
                </div>
                <span style={{
                  padding: '4px 12px', borderRadius: '20px', fontSize: '12px',
                  fontWeight: '600', background: sc.bg, color: sc.color,
                  textTransform: 'capitalize'
                }}>
                  {order.status}
                </span>
              </div>

              {/* Order Items */}
              {order.order_details?.map(item => (
                <div key={item.order_detail_id} style={{
                  display: 'flex', justifyContent: 'space-between',
                  padding: '8px 0', borderTop: '1px solid #f5f5f5',
                  fontSize: '14px', color: '#555'
                }}>
                  <span>{item.product_name} × {item.quantity}</span>
                  <span>₱{parseFloat(item.subtotal).toFixed(2)}</span>
                </div>
              ))}

              {/* Order Footer */}
              <div style={{
                display: 'flex', justifyContent: 'space-between',
                marginTop: '12px', paddingTop: '12px',
                borderTop: '2px solid #f5f5f5'
              }}>
                <span style={{ fontSize: '13px', color: '#888' }}>
                  <i className="fa-solid fa-location-dot"></i> {order.delivery_address}
                </span>
                <span style={{ fontWeight: '700', color: '#c0607a' }}>
                  ₱{parseFloat(order.total_amount).toFixed(2)}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Orders;
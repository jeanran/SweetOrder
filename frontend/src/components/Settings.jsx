import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';

function Settings() {
  const navigate = useNavigate();

  const [user, setUser]               = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [success, setSuccess]         = useState('');
  const [error, setError]             = useState('');
  const [loading, setLoading]         = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [notifications, setNotifications] = useState({
    orderUpdates: true,
    promotions:   false,
  });

  useEffect(() => {
    document.body.classList.add('page-loaded');   // ✅ fix blank page

    const stored = localStorage.getItem('user');
    if (!stored) {
      navigate('/login');
      return;
    }
    setUser(JSON.parse(stored));
    setLoadingUser(false);

    return () => document.body.classList.remove('page-loaded');
  }, [navigate]);

  const handleNotifChange = (key) => {
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
    setSuccess('Preferences saved.');
    setTimeout(() => setSuccess(''), 2000);
  };

  const handleDeleteAccount = async () => {
    const userId = localStorage.getItem('userId');
    setLoading(true);
    try {
      await api.delete('/auth/profile/', { data: { user_id: userId } });
      localStorage.removeItem('user');
      localStorage.removeItem('userId');
      navigate('/register');
    } catch (err) {
      setError('Failed to delete account. Please try again.');
    } finally {
      setLoading(false);
      setShowConfirm(false);
    }
  };

  if (loadingUser) return (
    <div style={{ padding: '40px', textAlign: 'center', color: '#888' }}>
      <i className="fa-solid fa-spinner fa-spin"></i> Loading...
    </div>
  );

  // ── Reusable Section card ───────────────────────────────────
  const Section = ({ title, icon, children }) => (
    <div style={{
      background: '#fff', borderRadius: '14px',
      padding: '22px', marginBottom: '16px',
      boxShadow: '0 2px 12px rgba(0,0,0,0.06)'
    }}>
      <h4 style={{
        margin: '0 0 16px', color: '#333',
        fontSize: '15px', display: 'flex',
        alignItems: 'center', gap: '8px'
      }}>
        {icon && <i className={`fa-solid ${icon}`}
                    style={{ color: '#c0607a', width: '16px' }}></i>}
        {title}
      </h4>
      {children}
    </div>
  );

  // ── Reusable Toggle switch ──────────────────────────────────
  const Toggle = ({ label, subtext, checked, onChange }) => (
    <div style={{
      display: 'flex', justifyContent: 'space-between',
      alignItems: 'center', padding: '12px 0',
      borderBottom: '1px solid #fafafa'
    }}>
      <div>
        <p style={{ margin: 0, fontSize: '14px', color: '#444' }}>{label}</p>
        {subtext && (
          <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#aaa' }}>
            {subtext}
          </p>
        )}
      </div>
      <div
        onClick={onChange}
        style={{
          width: '44px', height: '24px', borderRadius: '12px',
          cursor: 'pointer', flexShrink: 0, marginLeft: '16px',
          background: checked ? '#c0607a' : '#ddd',
          position: 'relative', transition: 'background 0.25s'
        }}
      >
        <div style={{
          position: 'absolute', top: '3px',
          left: checked ? '23px' : '3px',
          width: '18px', height: '18px',
          borderRadius: '50%', background: '#fff',
          transition: 'left 0.25s',
          boxShadow: '0 1px 4px rgba(0,0,0,0.2)'
        }} />
      </div>
    </div>
  );

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
          Settings
        </span>
        <Link to="/cart" style={{ color: '#c0607a', fontSize: '18px' }}>
          <i className="fa-solid fa-cart-shopping"></i>
        </Link>
      </header>

      <div style={{ maxWidth: '520px', margin: '0 auto', padding: '32px 16px' }}>

        {/* Alerts */}
        {success && (
          <div style={{
            background: '#e8f5e9', color: '#2e7d32', padding: '12px',
            borderRadius: '8px', marginBottom: '16px', fontSize: '14px',
            display: 'flex', alignItems: 'center', gap: '8px'
          }}>
            <i className="fa-solid fa-check-circle"></i> {success}
          </div>
        )}
        {error && (
          <div style={{
            background: '#ffebee', color: '#c62828', padding: '12px',
            borderRadius: '8px', marginBottom: '16px', fontSize: '14px',
            display: 'flex', alignItems: 'center', gap: '8px'
          }}>
            <i className="fa-solid fa-exclamation-circle"></i> {error}
          </div>
        )}

        {/* ── Account ─────────────────────────────────────── */}
        <Section title="Account" icon="fa-user">
          <div style={{
            display: 'flex', alignItems: 'center',
            gap: '14px', marginBottom: '16px'
          }}>
            <div style={{
              width: '52px', height: '52px', borderRadius: '50%',
              background: '#c0607a', color: '#fff', fontWeight: '700',
              fontSize: '18px', display: 'flex', alignItems: 'center',
              justifyContent: 'center', flexShrink: 0
            }}>
              {user?.name?.slice(0, 2).toUpperCase() || 'US'}
            </div>
            <div style={{ overflow: 'hidden' }}>
              <p style={{ margin: 0, fontWeight: '600', color: '#333' }}>
                {user?.name || 'Unknown User'}
              </p>
              <p style={{
                margin: '2px 0 0', fontSize: '13px', color: '#888',
                overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'
              }}>
                {user?.email || 'No Email'}
              </p>
              <span style={{
                display: 'inline-block', marginTop: '4px',
                padding: '2px 10px', background: '#f4c2ce',
                color: '#c0607a', borderRadius: '20px', fontSize: '11px'
              }}>
                {user?.role}
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={() => navigate('/profile')}
              style={{
                flex: 1, padding: '10px', background: '#fdf0f3',
                color: '#c0607a', border: '1px solid #f4c2ce',
                borderRadius: '8px', cursor: 'pointer',
                fontSize: '14px', fontWeight: '500'
              }}
            >
              <i className="fa-solid fa-pen" style={{ marginRight: '6px' }}></i>
              Edit Profile
            </button>
            <button
              onClick={() => navigate('/orders')}
              style={{
                flex: 1, padding: '10px', background: '#fdf0f3',
                color: '#c0607a', border: '1px solid #f4c2ce',
                borderRadius: '8px', cursor: 'pointer',
                fontSize: '14px', fontWeight: '500'
              }}
            >
              <i className="fa-solid fa-box" style={{ marginRight: '6px' }}></i>
              My Orders
            </button>
          </div>
        </Section>

        {/* ── Notifications ───────────────────────────────── */}
        <Section title="Notifications" icon="fa-bell">
          <Toggle
            label="Order status updates"
            subtext="Get notified when your order status changes"
            checked={notifications.orderUpdates}
            onChange={() => handleNotifChange('orderUpdates')}
          />
          <Toggle
            label="Promotions and offers"
            subtext="Receive special deals and discounts"
            checked={notifications.promotions}
            onChange={() => handleNotifChange('promotions')}
          />
        </Section>

        {/* ── About ───────────────────────────────────────── */}
        <Section title="About" icon="fa-circle-info">
          <div style={{ fontSize: '13px', color: '#888', lineHeight: '1.8' }}>
            <p style={{ margin: '0 0 4px' }}>
              <span style={{ color: '#555', fontWeight: '500' }}>App: </span>
              SweetOrder
            </p>
            <p style={{ margin: '0 0 4px' }}>
              <span style={{ color: '#555', fontWeight: '500' }}>Version: </span>
              1.0.0
            </p>
            <p style={{ margin: 0 }}>
              <span style={{ color: '#555', fontWeight: '500' }}>Made with: </span>
              React + Django REST Framework
            </p>
          </div>
        </Section>

        {/* ── Danger Zone ─────────────────────────────────── */}
        <Section title="Danger Zone" icon="fa-triangle-exclamation">
          <p style={{ fontSize: '13px', color: '#888', marginTop: 0, lineHeight: '1.6' }}>
            Permanently delete your account and all associated data.
            This action <strong>cannot be undone</strong>.
          </p>

          {!showConfirm ? (
            <button
              onClick={() => setShowConfirm(true)}
              style={{
                width: '100%', padding: '11px',
                background: '#ffebee', color: '#c62828',
                border: '1px solid #ffcdd2', borderRadius: '8px',
                cursor: 'pointer', fontSize: '14px', fontWeight: '500'
              }}
            >
              <i className="fa-solid fa-trash" style={{ marginRight: '6px' }}></i>
              Delete Account
            </button>
          ) : (
            <div style={{
              background: '#fff5f5', borderRadius: '10px',
              padding: '16px', border: '1px solid #ffcdd2'
            }}>
              <p style={{ color: '#c62828', fontSize: '14px',
                          margin: '0 0 14px', fontWeight: '500' }}>
                <i className="fa-solid fa-triangle-exclamation"
                   style={{ marginRight: '6px' }}></i>
                Are you absolutely sure?
              </p>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  onClick={handleDeleteAccount}
                  disabled={loading}
                  style={{
                    flex: 1, padding: '11px', background: '#c62828',
                    color: '#fff', border: 'none', borderRadius: '8px',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    fontWeight: '600', opacity: loading ? 0.7 : 1
                  }}
                >
                  {loading
                    ? <><i className="fa-solid fa-spinner fa-spin"></i> Deleting...</>
                    : 'Yes, Delete My Account'
                  }
                </button>
                <button
                  onClick={() => setShowConfirm(false)}
                  style={{
                    flex: 1, padding: '11px', background: '#fff',
                    color: '#666', border: '1px solid #ddd',
                    borderRadius: '8px', cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </Section>

        <div style={{ height: '40px' }} />
      </div>
    </div>
  );
}

export default Settings;
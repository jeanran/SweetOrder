import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

function Settings() {
  const navigate = useNavigate();
  const [user, setUser]         = useState(null);
  const [success, setSuccess]   = useState('');
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [notifications, setNotifications] = useState({
    orderUpdates: true,
    promotions:   false,
  });

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (!stored) { navigate('/login'); return; }
    setUser(JSON.parse(stored));
  }, [navigate]);

  const handleNotifChange = (key) => {
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
    setSuccess('Notification preferences saved.');
    setTimeout(() => setSuccess(''), 2000);
  };

  const handleDeleteAccount = async () => {
    const userId = localStorage.getItem('userId');
    setLoading(true);
    try {
      await api.delete(`/auth/profile/`, { data: { user_id: userId } });
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

  const Section = ({ title, children }) => (
    <div style={{
      background: '#fff', borderRadius: '14px', padding: '22px',
      marginBottom: '16px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)'
    }}>
      <h4 style={{ margin: '0 0 16px', color: '#333', fontSize: '15px' }}>{title}</h4>
      {children}
    </div>
  );

  const Toggle = ({ label, checked, onChange }) => (
    <div style={{ display: 'flex', justifyContent: 'space-between',
                  alignItems: 'center', padding: '10px 0' }}>
      <span style={{ fontSize: '14px', color: '#555' }}>{label}</span>
      <div
        onClick={onChange}
        style={{
          width: '42px', height: '24px', borderRadius: '12px', cursor: 'pointer',
          background: checked ? '#c0607a' : '#ddd', position: 'relative',
          transition: 'background 0.2s'
        }}
      >
        <div style={{
          position: 'absolute', top: '3px',
          left: checked ? '21px' : '3px',
          width: '18px', height: '18px', borderRadius: '50%',
          background: '#fff', transition: 'left 0.2s',
          boxShadow: '0 1px 4px rgba(0,0,0,0.2)'
        }} />
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: '#fdf6f8', padding: '40px 20px' }}>
      <div style={{ maxWidth: '520px', margin: '0 auto' }}>

        <button
          onClick={() => navigate(-1)}
          style={{ background: 'none', border: 'none', cursor: 'pointer',
                   fontSize: '14px', color: '#c0607a', marginBottom: '24px',
                   display: 'flex', alignItems: 'center', gap: '6px' }}
        >
          <i className="fa-solid fa-arrow-left"></i> Back
        </button>

        <h2 style={{ marginBottom: '24px', color: '#333' }}>Settings</h2>

        {success && (
          <div style={{ background: '#e8f5e9', color: '#2e7d32', padding: '12px',
                        borderRadius: '8px', marginBottom: '16px', fontSize: '14px' }}>
            <i className="fa-solid fa-check-circle"></i> {success}
          </div>
        )}
        {error && (
          <div style={{ background: '#ffebee', color: '#c62828', padding: '12px',
                        borderRadius: '8px', marginBottom: '16px', fontSize: '14px' }}>
            <i className="fa-solid fa-exclamation-circle"></i> {error}
          </div>
        )}

        {/* Account Info */}
        <Section title="Account">
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{
              width: '48px', height: '48px', borderRadius: '50%',
              background: '#f4c2ce', color: '#c0607a', fontWeight: '700',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              {user?.name?.slice(0,2).toUpperCase()}
            </div>
            <div>
              <p style={{ margin: 0, fontWeight: '600', color: '#333' }}>{user?.name}</p>
              <p style={{ margin: 0, fontSize: '13px', color: '#888' }}>{user?.email}</p>
            </div>
          </div>
          <button
            onClick={() => navigate('/profile')}
            style={{
              marginTop: '14px', width: '100%', padding: '10px',
              background: '#fdf0f3', color: '#c0607a', border: '1px solid #f4c2ce',
              borderRadius: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: '500'
            }}
          >
            <i className="fa-solid fa-pen"></i> Edit Profile
          </button>
        </Section>

        {/* Notifications */}
        <Section title="Notifications">
          <Toggle
            label="Order status updates"
            checked={notifications.orderUpdates}
            onChange={() => handleNotifChange('orderUpdates')}
          />
          <Toggle
            label="Promotions and offers"
            checked={notifications.promotions}
            onChange={() => handleNotifChange('promotions')}
          />
        </Section>

        {/* Danger Zone */}
        <Section title="Danger Zone">
          <p style={{ fontSize: '13px', color: '#888', marginTop: 0 }}>
            Deleting your account is permanent and cannot be undone.
          </p>
          {!showConfirm ? (
            <button
              onClick={() => setShowConfirm(true)}
              style={{
                width: '100%', padding: '10px', background: '#ffebee',
                color: '#c62828', border: '1px solid #ffcdd2',
                borderRadius: '8px', cursor: 'pointer', fontSize: '14px'
              }}
            >
              <i className="fa-solid fa-trash"></i> Delete Account
            </button>
          ) : (
            <div style={{ background: '#ffebee', borderRadius: '10px', padding: '14px' }}>
              <p style={{ color: '#c62828', fontSize: '14px', margin: '0 0 12px' }}>
                Are you sure? This cannot be undone.
              </p>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  onClick={handleDeleteAccount}
                  disabled={loading}
                  style={{
                    flex: 1, padding: '10px', background: '#c62828',
                    color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer'
                  }}
                >
                  {loading ? 'Deleting...' : 'Yes, Delete'}
                </button>
                <button
                  onClick={() => setShowConfirm(false)}
                  style={{
                    flex: 1, padding: '10px', background: '#fff',
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

      </div>
    </div>
  );
}

export default Settings;
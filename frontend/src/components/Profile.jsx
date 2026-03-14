import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

function Profile() {
  const navigate = useNavigate();
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError]     = useState('');

  const [formData, setFormData] = useState({
    name:     '',
    email:    '',
    password: '',
    confirm_password: ''
  });

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (!stored) { navigate('/login'); return; }
    const userData = JSON.parse(stored);
    setUser(userData);
    setFormData(prev => ({
      ...prev,
      name:  userData.name  || '',
      email: userData.email || '',
    }));
  }, [navigate]);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (formData.password && formData.password !== formData.confirm_password) {
      setError('Passwords do not match.');
      return;
    }
    if (formData.password && formData.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    try {
      const payload = { name: formData.name, email: formData.email };
      if (formData.password) payload.password = formData.password;

      const response = await api.patch(`/auth/profile/`, payload);

      // ✅ update localStorage with new info
      const updated = { ...user, name: formData.name, email: formData.email };
      localStorage.setItem('user', JSON.stringify(updated));
      setUser(updated);
      setSuccess('Profile updated successfully!');
      setFormData(prev => ({ ...prev, password: '', confirm_password: '' }));

    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  const getInitials = (name) => {
    if (!name) return '?';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <div style={{ minHeight: '100vh', background: '#fdf6f8', padding: '40px 20px' }}>
      <div style={{ maxWidth: '520px', margin: '0 auto' }}>

        {/* Back */}
        <button
          onClick={() => navigate(-1)}
          style={{ background: 'none', border: 'none', cursor: 'pointer',
                   fontSize: '14px', color: '#c0607a', marginBottom: '24px',
                   display: 'flex', alignItems: 'center', gap: '6px' }}
        >
          <i className="fa-solid fa-arrow-left"></i> Back
        </button>

        {/* Avatar */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div style={{
            width: '80px', height: '80px', borderRadius: '50%',
            background: '#c0607a', color: '#fff', fontSize: '28px',
            fontWeight: '700', display: 'flex', alignItems: 'center',
            justifyContent: 'center', margin: '0 auto 12px'
          }}>
            {getInitials(user?.name)}
          </div>
          <h2 style={{ margin: 0, color: '#333' }}>{user?.name}</h2>
          <p style={{ margin: '4px 0 0', color: '#888', fontSize: '14px' }}>{user?.email}</p>
        </div>

        {/* Form Card */}
        <div style={{
          background: '#fff', borderRadius: '16px',
          padding: '28px', boxShadow: '0 4px 20px rgba(0,0,0,0.06)'
        }}>
          <h3 style={{ marginTop: 0, color: '#333' }}>Edit Profile</h3>

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

          <form onSubmit={handleSubmit}>
            {[
              { label: 'Full Name',        name: 'name',             type: 'text',     placeholder: 'Your full name' },
              { label: 'Email Address',    name: 'email',            type: 'email',    placeholder: 'Your email' },
              { label: 'New Password',     name: 'password',         type: 'password', placeholder: 'Leave blank to keep current' },
              { label: 'Confirm Password', name: 'confirm_password', type: 'password', placeholder: 'Confirm new password' },
            ].map(field => (
              <div key={field.name} style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '13px',
                                color: '#666', marginBottom: '6px' }}>
                  {field.label}
                </label>
                <input
                  type={field.type}
                  name={field.name}
                  placeholder={field.placeholder}
                  value={formData[field.name]}
                  onChange={handleChange}
                  style={{
                    width: '100%', padding: '10px 14px', borderRadius: '8px',
                    border: '1px solid #e0e0e0', fontSize: '14px',
                    outline: 'none', boxSizing: 'border-box'
                  }}
                />
              </div>
            ))}

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%', padding: '12px', background: '#c0607a',
                color: '#fff', border: 'none', borderRadius: '10px',
                fontSize: '15px', fontWeight: '600', cursor: 'pointer',
                marginTop: '8px', opacity: loading ? 0.7 : 1
              }}
            >
              {loading
                ? <><i className="fa-solid fa-spinner fa-spin"></i> Saving...</>
                : 'Save Changes'
              }
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Profile;
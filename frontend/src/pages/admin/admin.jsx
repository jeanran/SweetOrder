import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Home from './pages/home';
import Menu from './pages/menu';
import Orders from './pages/orders';
import Users from './pages/users';
import Category from './pages/category';
import Settings from './pages/settings';

const AdminPanel = () => {
  const [currentPage, setCurrentPage] = useState('home');
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem('user') || 'null');

  useEffect(() => {
    // Add the page-loaded class to body
    document.body.classList.add('page-loaded');

    // Check if admin is logged in
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    console.log('Token:', token);
    console.log('User:', JSON.stringify(user));
    if (!token || !user) {
      console.log('Redirecting to login: no token or user');
      navigate('/login');
      return;
    }
    if (user.role !== 'admin') {
      console.log('Redirecting to homepage: not admin');
      navigate('/homepage');
      return;
    }
    console.log('Admin logged in, staying on admin panel');

    // Cleanup
    return () => {
      document.body.classList.remove('page-loaded');
    };
  }, [navigate, user]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const renderPage = () => {
    console.log('Rendering page:', currentPage);
    switch (currentPage) {
      case 'home':
        return <Home />;
      case 'menu':
        return <Menu />;
      case 'orders':
        return <Orders />;
      case 'users':
        return <Users />;
      case 'category':
        return <Category />;
      case 'settings':
        return <Settings />;
      default:
        return <Home />;
    }
  };

  if (!user) return <div>Loading...</div>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', fontFamily: "'Quicksand', sans-serif" }}>
      {/* Header */}
      <header style={{
        backgroundColor: '#FFECF2',
        padding: '20px 40px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000
      }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <img src="/assets/logos.png" alt="SweetOrder Logo" style={{ width: '50px', marginRight: '20px' }} />
          <h1 style={{ color: '#c46b6b', margin: 0, fontSize: '24px' }}>SweetOrder Admin</h1>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <span style={{ color: '#333', fontWeight: '500' }}>Administrator</span>
          <div style={{ position: 'relative' }}>
            <button style={{
              backgroundColor: '#c46b6b',
              color: 'white',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '20px',
              cursor: 'pointer',
              fontSize: '14px'
            }} onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div style={{ display: 'flex', flex: 1, marginTop: '90px' }}>
        {/* Sidebar */}
        <aside style={{
          width: '250px',
          backgroundColor: '#fff',
          boxShadow: '2px 0 10px rgba(0,0,0,0.1)',
          padding: '20px 0',
          position: 'fixed',
          top: '80px',
          left: 0,
          height: 'calc(100vh - 0px)',
          overflowY: 'auto'
        }}>
          <nav>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              <li>
                <button
                  onClick={() => setCurrentPage('home')}
                  style={{
                    width: '100%',
                    padding: '15px 20px',
                    border: 'none',
                    backgroundColor: currentPage === 'home' ? '#FFECF2' : 'transparent',
                    color: currentPage === 'home' ? '#c46b6b' : '#333',
                    textAlign: 'left',
                    cursor: 'pointer',
                    fontSize: '16px',
                    fontWeight: '500',
                    transition: 'all 0.3s'
                  }}
                >
                  🏠 Dashboard
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentPage('menu')}
                  style={{
                    width: '100%',
                    padding: '15px 20px',
                    border: 'none',
                    backgroundColor: currentPage === 'menu' ? '#FFECF2' : 'transparent',
                    color: currentPage === 'menu' ? '#c46b6b' : '#333',
                    textAlign: 'left',
                    cursor: 'pointer',
                    fontSize: '16px',
                    fontWeight: '500',
                    transition: 'all 0.3s'
                  }}
                >
                  🍰 Products
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentPage('orders')}
                  style={{
                    width: '100%',
                    padding: '15px 20px',
                    border: 'none',
                    backgroundColor: currentPage === 'orders' ? '#FFECF2' : 'transparent',
                    color: currentPage === 'orders' ? '#c46b6b' : '#333',
                    textAlign: 'left',
                    cursor: 'pointer',
                    fontSize: '16px',
                    fontWeight: '500',
                    transition: 'all 0.3s'
                  }}
                >
                  📦 Orders
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentPage('users')}
                  style={{
                    width: '100%',
                    padding: '15px 20px',
                    border: 'none',
                    backgroundColor: currentPage === 'users' ? '#FFECF2' : 'transparent',
                    color: currentPage === 'users' ? '#c46b6b' : '#333',
                    textAlign: 'left',
                    cursor: 'pointer',
                    fontSize: '16px',
                    fontWeight: '500',
                    transition: 'all 0.3s'
                  }}
                >
                  👥 Users
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentPage('category')}
                  style={{
                    width: '100%',
                    padding: '15px 20px',
                    border: 'none',
                    backgroundColor: currentPage === 'category' ? '#FFECF2' : 'transparent',
                    color: currentPage === 'category' ? '#c46b6b' : '#333',
                    textAlign: 'left',
                    cursor: 'pointer',
                    fontSize: '16px',
                    fontWeight: '500',
                    transition: 'all 0.3s'
                  }}
                >
                  📂 Categories
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentPage('settings')}
                  style={{
                    width: '100%',
                    padding: '15px 20px',
                    border: 'none',
                    backgroundColor: currentPage === 'settings' ? '#FFECF2' : 'transparent',
                    color: currentPage === 'settings' ? '#c46b6b' : '#333',
                    textAlign: 'left',
                    cursor: 'pointer',
                    fontSize: '16px',
                    fontWeight: '500',
                    transition: 'all 0.3s'
                  }}
                >
                  ⚙️ Settings
                </button>
              </li>
            </ul>
          </nav>
        </aside>

        {/* Content */}
        <main style={{
          width: 'calc(100vw - 250px)',
          marginLeft: '250px',
          padding: '20px',
          backgroundColor: '#f9f9f9',
          minHeight: 'calc(100vh - 90px)',
          overflowX: 'auto'
        }}>
          {renderPage()}
        </main>
      </div>
    </div>
  );
};

export default AdminPanel;

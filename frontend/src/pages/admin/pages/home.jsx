import React, { useState, useEffect } from 'react';
import api from '../../../services/api';

const Home = () => {
  console.log('Home component rendered');
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalSales: 0,
    totalUsers: 0,
    totalProducts: 0
  });

  const fetchStats = async () => {
    try {
      const res = await api.get('/stats/');
      setStats({
        totalOrders: res.data.total_orders,
        totalSales: res.data.total_sales,
        totalUsers: res.data.total_users,
        totalProducts: res.data.total_products
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
      setStats({
        totalOrders: 0,
        totalSales: 0,
        totalUsers: 0,
        totalProducts: 0
      });
    }
  };

  useEffect(() => {
    // eslint-disable-next-line
    fetchStats();
  }, []);

  return (
    <div>
      <h1 style={{ marginBottom: '30px', color: '#333' }}>Dashboard</h1>

      {/* Summary Cards */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '20px',
        marginBottom: '40px'
      }}>
        <div style={{
          backgroundColor: '#fff',
          padding: '20px',
          borderRadius: '10px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
          textAlign: 'center'
        }}>
          <h3 style={{ color: '#c46b6b', marginBottom: '10px' }}>Total Orders</h3>
          <p style={{ fontSize: '32px', fontWeight: 'bold', color: '#333' }}>{stats.totalOrders}</p>
        </div>

        <div style={{
          backgroundColor: '#fff',
          padding: '20px',
          borderRadius: '10px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
          textAlign: 'center'
        }}>
          <h3 style={{ color: '#c46b6b', marginBottom: '10px' }}>Total Sales</h3>
          <p style={{ fontSize: '32px', fontWeight: 'bold', color: '#333' }}>${stats.totalSales.toFixed(2)}</p>
        </div>

        <div style={{
          backgroundColor: '#fff',
          padding: '20px',
          borderRadius: '10px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
          textAlign: 'center'
        }}>
          <h3 style={{ color: '#c46b6b', marginBottom: '10px' }}>Total Users</h3>
          <p style={{ fontSize: '32px', fontWeight: 'bold', color: '#333' }}>{stats.totalUsers}</p>
        </div>

        <div style={{
          backgroundColor: '#fff',
          padding: '20px',
          borderRadius: '10px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
          textAlign: 'center'
        }}>
          <h3 style={{ color: '#c46b6b', marginBottom: '10px' }}>Total Products</h3>
          <p style={{ fontSize: '32px', fontWeight: 'bold', color: '#333' }}>{stats.totalProducts}</p>
        </div>
      </div>

      {/* Recent Activity or Charts Placeholder */}
      <div style={{
        backgroundColor: '#fff',
        padding: '20px',
        borderRadius: '10px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
      }}>
        <h2 style={{ color: '#333', marginBottom: '20px' }}>Recent Activity</h2>
        <p style={{ color: '#666' }}>Recent orders, user registrations, and product updates will be displayed here.</p>
        {/* TODO: Add charts or activity feed */}
      </div>
    </div>
  );
};

export default Home;
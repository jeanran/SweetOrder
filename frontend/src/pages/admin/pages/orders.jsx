import React, { useState, useEffect } from 'react';
import api from '../../../services/api';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const fetchOrders = async () => {
    try {
      const res = await api.get('/orders/');
      setOrders(res.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setOrders([]);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line
    fetchOrders();
  }, []);

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      await api.patch(`/orders/${orderId}/`, { status: newStatus });
      setOrders(orders.map(order =>
        order.order_id === orderId ? { ...order, status: newStatus } : order
      ));
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending': return '#ff9800';
      case 'Confirmed': return '#2196f3';
      case 'Preparing': return '#9c27b0';
      case 'Delivered': return '#4caf50';
      case 'Cancelled': return '#f44336';
      default: return '#666';
    }
  };

  return (
    <div>
      <h1 style={{ marginBottom: '30px', color: '#333' }}>Order Management</h1>

      <div style={{ display: 'flex', gap: '20px' }}>
        {/* Orders List */}
        <div style={{
          flex: 1,
          backgroundColor: '#fff',
          borderRadius: '10px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
          overflow: 'hidden'
        }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#f5f5f5' }}>
                <th style={{ padding: '15px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Order ID</th>
                <th style={{ padding: '15px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Customer</th>
                <th style={{ padding: '15px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Total</th>
                <th style={{ padding: '15px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Status</th>
                <th style={{ padding: '15px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Date</th>
                <th style={{ padding: '15px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(order => (
                <tr
                  key={order.order_id}
                  onClick={() => setSelectedOrder(order)}
                  style={{
                    borderBottom: '1px solid #eee',
                    cursor: 'pointer',
                    backgroundColor: selectedOrder?.order_id === order.order_id ? '#f0f8ff' : 'transparent'
                  }}
                >
                  <td style={{ padding: '15px' }}>#{order.order_id}</td>
                  <td style={{ padding: '15px' }}>{order.user.name}</td>
                  <td style={{ padding: '15px' }}>${order.total_amount.toFixed(2)}</td>
                  <td style={{ padding: '15px' }}>
                    <span style={{
                      backgroundColor: getStatusColor(order.status),
                      color: 'white',
                      padding: '4px 8px',
                      borderRadius: '12px',
                      fontSize: '12px',
                      fontWeight: 'bold'
                    }}>
                      {order.status}
                    </span>
                  </td>
                  <td style={{ padding: '15px' }}>{order.created_at}</td>
                  <td style={{ padding: '15px' }}>
                    <select
                      value={order.status}
                      onChange={(e) => updateOrderStatus(order.order_id, e.target.value)}
                      style={{
                        padding: '5px',
                        border: '1px solid #ddd',
                        borderRadius: '4px',
                        backgroundColor: 'white'
                      }}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Confirmed">Confirmed</option>
                      <option value="Preparing">Preparing</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Order Details */}
        {selectedOrder && (
          <div style={{
            width: '300px',
            backgroundColor: '#fff',
            borderRadius: '10px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
            padding: '20px'
          }}>
            <h3 style={{ marginBottom: '20px', color: '#333' }}>Order Details</h3>
            <p><strong>Order ID:</strong> #{selectedOrder.id}</p>
            <p><strong>Customer:</strong> {selectedOrder.customer}</p>
            <p><strong>Date:</strong> {selectedOrder.date}</p>
            <p><strong>Status:</strong>
              <span style={{
                backgroundColor: getStatusColor(selectedOrder.status),
                color: 'white',
                padding: '2px 6px',
                borderRadius: '10px',
                fontSize: '12px',
                marginLeft: '5px'
              }}>
                {selectedOrder.status}
              </span>
            </p>
            <h4 style={{ marginTop: '20px', marginBottom: '10px' }}>Items:</h4>
            {selectedOrder.items.map((item, index) => (
              <div key={index} style={{ marginBottom: '10px', padding: '10px', backgroundColor: '#f9f9f9', borderRadius: '5px' }}>
                <p style={{ margin: 0 }}><strong>{item.name}</strong></p>
                <p style={{ margin: 0 }}>Quantity: {item.quantity} | Price: ${item.price}</p>
              </div>
            ))}
            <p style={{ marginTop: '20px', fontSize: '18px', fontWeight: 'bold' }}>Total: ${selectedOrder.total.toFixed(2)}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
import React, { useState, useEffect } from 'react';
import api from '../../../services/api';

const Users = () => {
  const [users, setUsers] = useState([]);

  const fetchUsers = async () => {
    try {
      const res = await api.get('/users/');
      setUsers(res.data);
    } catch (error) {
      console.error('Error fetching users:', error);
      setUsers([]);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line
    fetchUsers();
  }, []);

  const updateUserRole = async (userId, newRole) => {
    try {
      await api.patch(`/users/${userId}/`, { role: newRole });
      setUsers(users.map(user =>
        user.user_id === userId ? { ...user, role: newRole } : user
      ));
    } catch (error) {
      console.error('Error updating user role:', error);
    }
  };

  const deleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        // TODO: await api.delete(`/users/${userId}/`);
        setUsers(users.filter(user => user.id !== userId));
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    }
  };

  const getRoleColor = (role) => {
    return role === 'admin' ? '#c46b6b' : '#4caf50';
  };

  return (
    <div>
      <h1 style={{ marginBottom: '30px', color: '#333' }}>User Management</h1>

      <div style={{
        backgroundColor: '#fff',
        borderRadius: '10px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        overflow: 'hidden'
      }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#f5f5f5' }}>
              <th style={{ padding: '15px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>User ID</th>
              <th style={{ padding: '15px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Name</th>
              <th style={{ padding: '15px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Email</th>
              <th style={{ padding: '15px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Role</th>
              <th style={{ padding: '15px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Date Joined</th>
              <th style={{ padding: '15px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.user_id} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '15px' }}>{user.user_id}</td>
                <td style={{ padding: '15px' }}>{user.name}</td>
                <td style={{ padding: '15px' }}>{user.email}</td>
                <td style={{ padding: '15px' }}>
                  <select
                    value={user.role}
                    onChange={(e) => updateUserRole(user.user_id, e.target.value)}
                    style={{
                      padding: '5px',
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                      backgroundColor: getRoleColor(user.role),
                      color: 'white',
                      fontWeight: 'bold'
                    }}
                  >
                    <option value="customer">Customer</option>
                    <option value="admin">Admin</option>
                  </select>
                </td>
                <td style={{ padding: '15px' }}>{user.created_at}</td>
                <td style={{ padding: '15px' }}>
                  <button
                    onClick={() => deleteUser(user.user_id)}
                    style={{
                      backgroundColor: '#f44336',
                      color: 'white',
                      border: 'none',
                      padding: '5px 10px',
                      borderRadius: '3px',
                      cursor: 'pointer'
                    }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Users;
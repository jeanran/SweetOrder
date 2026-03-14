import React, { useState, useEffect, useRef } from 'react';
import api from '../../../services/api';

const Category = () => {
  const [categories, setCategories] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  });
  const idCounter = useRef(4);

  const fetchCategories = async () => {
    try {
      const res = await api.get('/categories/');
      // Assuming res.data is array of strings
      setCategories(res.data.map((name, index) => ({ id: index + 1, name, description: '' })));
    } catch (error) {
      console.error('Error fetching categories:', error);
      setCategories([]);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line
    fetchCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingCategory) {
        // TODO: await api.put(`/categories/${editingCategory.id}/`, formData);
        setCategories(categories.map(c => c.id === editingCategory.id ? { ...c, ...formData } : c));
      } else {
        // TODO: const res = await api.post('/categories/', formData);
        const newCategory = { ...formData, id: idCounter.current++ };
        setCategories([...categories, newCategory]);
      }
      setShowModal(false);
      setEditingCategory(null);
      resetForm();
    } catch (error) {
      console.error('Error saving category:', error);
    }
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      description: category.description
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      try {
        // TODO: await api.delete(`/categories/${id}/`);
        setCategories(categories.filter(c => c.id !== id));
      } catch (error) {
        console.error('Error deleting category:', error);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: ''
    });
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h1 style={{ color: '#333' }}>Category Management</h1>
        <button
          onClick={() => { setShowModal(true); setEditingCategory(null); resetForm(); }}
          style={{
            backgroundColor: '#c46b6b',
            color: 'white',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '16px'
          }}
        >
          Add Category
        </button>
      </div>

      {/* Categories Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: '20px'
      }}>
        {categories.map(category => (
          <div key={category.id} style={{
            backgroundColor: '#fff',
            borderRadius: '10px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
            padding: '20px',
            position: 'relative'
          }}>
            <h3 style={{ color: '#c46b6b', marginBottom: '10px' }}>{category.name}</h3>
            <p style={{ color: '#666', marginBottom: '20px' }}>{category.description}</p>
            <div style={{ position: 'absolute', top: '20px', right: '20px' }}>
              <button
                onClick={() => handleEdit(category)}
                style={{
                  backgroundColor: '#4CAF50',
                  color: 'white',
                  border: 'none',
                  padding: '5px 10px',
                  borderRadius: '3px',
                  cursor: 'pointer',
                  marginRight: '5px'
                }}
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(category.id)}
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
            </div>
          </div>
        ))}
      </div>

      {/* Modal for Add/Edit */}
      {showModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: '#fff',
            padding: '20px',
            borderRadius: '10px',
            width: '400px',
            maxWidth: '90%'
          }}>
            <h2 style={{ marginBottom: '20px' }}>{editingCategory ? 'Edit Category' : 'Add Category'}</h2>
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px' }}>Name:</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
                />
              </div>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px' }}>Description:</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                  style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px', minHeight: '80px' }}
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => { setShowModal(false); setEditingCategory(null); resetForm(); }}
                  style={{
                    backgroundColor: '#ccc',
                    color: '#333',
                    border: 'none',
                    padding: '10px 20px',
                    borderRadius: '5px',
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    backgroundColor: '#c46b6b',
                    color: 'white',
                    border: 'none',
                    padding: '10px 20px',
                    borderRadius: '5px',
                    cursor: 'pointer'
                  }}
                >
                  {editingCategory ? 'Update' : 'Add'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Category;
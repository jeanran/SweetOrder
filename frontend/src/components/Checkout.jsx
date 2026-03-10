import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/checkout.css';

function Checkout() {
  const navigate = useNavigate();

  useEffect(() => {
    document.body.classList.add('page-loaded');
    return () => {
      document.body.classList.remove('page-loaded');
    };
  }, []);

  // Sample cart data
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: 'Wedding Cake',
      price: 35.00,
      quantity: 1,
      image: '/assets/3layer_weddingcake.jpg'
    },
    {
      id: 2,
      name: 'Birthday Cake',
      price: 32.00,
      quantity: 2,
      image: '/assets/birthdaycake.jpg'
    },
    {
      id: 3,
      name: 'Men\'s Birthday Cake',
      price: 40.00,
      quantity: 1,
      image: '/assets/men-birthdaycake.jpg'
    }
  ]);

  // Form state
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    paymentMethod: 'cash'
  });

  // Calculate totals
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const deliveryFee = 5;
  const total = subtotal + deliveryFee;

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle payment method change
  const handlePaymentChange = (e) => {
    setFormData(prev => ({
      ...prev,
      paymentMethod: e.target.value
    }));
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Order placed:', { formData, cartItems, total });
    alert('Order placed successfully!');
    navigate('/');
  };

  const goBack = () => {
    navigate(-1);
  };

  return (
    <section className="checkout-page">
      {/* Back Button */}
      <button className="back-button" onClick={goBack}>
        <i className="fa-solid fa-arrow-left"></i> Back
      </button>

      <h1 className="checkout-title">Checkout</h1>

      <div className="checkout-container">
        {/* LEFT SIDE - FORM */}
        <div className="checkout-form">
          <h2>Customer Information</h2>

          <form id="order-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Full Name</label>
              <input 
                type="text" 
                name="fullName"
                placeholder="Enter your full name" 
                value={formData.fullName}
                onChange={handleInputChange}
                required 
              />
            </div>

            <div className="form-group">
              <label>Email Address</label>
              <input 
                type="email" 
                name="email"
                placeholder="Enter your email" 
                value={formData.email}
                onChange={handleInputChange}
                required 
              />
            </div>

            <div className="form-group">
              <label>Phone Number</label>
              <input 
                type="text" 
                name="phone"
                placeholder="Enter your phone number" 
                value={formData.phone}
                onChange={handleInputChange}
                required 
              />
            </div>

            <div className="form-group">
              <label>Delivery Address</label>
              <textarea 
                name="address"
                placeholder="Enter your delivery address" 
                value={formData.address}
                onChange={handleInputChange}
                required
              ></textarea>
            </div>

            <h3 className="payment-title">Payment Method</h3>

            <div className="payment-methods">
              <label className="payment-option">
                <input 
                  type="radio" 
                  name="payment" 
                  value="cash"
                  checked={formData.paymentMethod === 'cash'}
                  onChange={handlePaymentChange}
                />
                <span>Cash on Delivery</span>
              </label>

              <label className="payment-option">
                <input 
                  type="radio" 
                  name="payment" 
                  value="card"
                  checked={formData.paymentMethod === 'card'}
                  onChange={handlePaymentChange}
                />
                <span>Credit / Debit Card</span>
              </label>
            </div>

            <button type="submit" className="place-order">
              Place Order
            </button>
          </form>
        </div>

        {/* RIGHT SIDE - ORDER SUMMARY */}
        <div className="order-summary">
          <h3>Order Summary</h3>

          <div id="checkout-items" className="checkout-items">
            {cartItems.map(item => (
              <div key={item.id} className="checkout-item">
                <div className="checkout-item-info">
                  <span className="item-name">{item.name}</span>
                  <span className="item-qty">x{item.quantity}</span>
                </div>
                <span className="item-price">${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>

          <hr />

          <div className="summary-row">
            <span>Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>

          <div className="summary-row">
            <span>Delivery</span>
            <span>${deliveryFee.toFixed(2)}</span>
          </div>

          <div className="summary-row total">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>

          <Link to="/cart" className="back-to-cart">
            ← Back to Cart
          </Link>
        </div>
      </div>
    </section>
  );
}

export default Checkout;
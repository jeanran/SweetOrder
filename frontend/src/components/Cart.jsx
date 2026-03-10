import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';  // Add useNavigate
import '../styles/cart.css';

function Cart() {
  const navigate = useNavigate();  // Add this for navigation

  // Add this useEffect for opacity
  useEffect(() => {
    document.body.classList.add('page-loaded');
    return () => {
      document.body.classList.remove('page-loaded');
    };
  }, []);

  // Sample cart data - in a real app, this would come from state/context
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

  // Calculate subtotal and total
  const [subtotal, setSubtotal] = useState(0);
  const deliveryFee = 5;

  useEffect(() => {
    const newSubtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    setSubtotal(newSubtotal);
  }, [cartItems]);

  // Update quantity
  const updateQuantity = (id, newQuantity) => {
    if (newQuantity < 1) return;
    setCartItems(items =>
      items.map(item =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  // Remove item
  const removeItem = (id) => {
    setCartItems(items => items.filter(item => item.id !== id));
  };

  // Go back function
  const goBack = () => {
    navigate(-1);  // This goes to the previous page
  };

  return (
    <div className="cart-page">
      {/* Back Button */}
      <button className="back-button" onClick={goBack}>
        <i className="fa-solid fa-arrow-left"></i> Back
      </button>

      <div className="cart-container">
        {/* PRODUCTS SECTION */}
        <div className="cart-items" id="cart-items">
          {cartItems.length === 0 ? (
            <div className="empty-cart">
              <h3>Your cart is empty</h3>
              <Link to="/" className="continue-shopping">Continue Shopping</Link>
            </div>
          ) : (
            cartItems.map(item => (
              <div key={item.id} className="cart-card">
                <div className="cart-product">
                  <img src={item.image} alt={item.name} className="cart-img" />
                  <div>
                    <h4>{item.name}</h4>
                    <p>${item.price.toFixed(2)}</p>
                  </div>
                </div>
                
                <div className="cart-qty">
                  <button 
                    className="qty-minus"
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  >−</button>
                  <span>{item.quantity}</span>
                  <button 
                    className="qty-plus"
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  >+</button>
                </div>
                
                <div className="cart-price">
                  ${(item.price * item.quantity).toFixed(2)}
                </div>
                
                <button 
                  className="cart-remove"
                  onClick={() => removeItem(item.id)}
                >
                  <i className="fa-solid fa-trash"></i>
                </button>
              </div>
            ))
          )}
        </div>

        {/* ORDER SUMMARY */}
        <div className="cart-summary">
          <h3>Order Summary</h3>
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
            <span>${(subtotal + deliveryFee).toFixed(2)}</span>
          </div>
          <Link to="/checkout">
            <button className="checkout-btn">Checkout Now</button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Cart;
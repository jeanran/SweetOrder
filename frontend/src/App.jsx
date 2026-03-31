import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import LandingPage from './components/LandingPage';
import Login from './components/Login';
import Register from './components/Register';
import Cart from './components/Cart';
import Checkout from './components/Checkout';
import Homepage from './components/Homepage';
import About from './components/About';
import Products from './components/Products';
import Testimonials from './components/Testimonials';
import Contacts from './components/Contacts';
import Profile from './components/Profile';
import Orders from './components/Orders';
import Settings from './components/Settings';
import OrderConfirmation from './components/OrderConfirmation';


import './App.css';

import Admin        from './pages/admin/admin';   



function App() {
  return (
    
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/homepage" element={<Homepage />} />
          <Route path="/about" element={<About />} />
          <Route path="/products" element={<Products />} />
          <Route path="/testimonials" element={<Testimonials />} />
          <Route path="/contacts" element={<Contacts />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/order-confirmation" element={<OrderConfirmation />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/settings" element={<Settings />} />

          <Route path="/admin/dashboard" element={<Admin />} />
        </Routes>
      </BrowserRouter>
    
  );
}

export default App;
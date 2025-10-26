import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Layout Components
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import ProtectedRoute from './components/auth/ProtectedRoute';

// Pages
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import Pricing from './pages/Pricing';
import NotFound from './pages/NotFound';

// Auth
import Login from './components/auth/Login';
import Register from './components/auth/Register';

// Products
import ProductList from './components/products/ProductList';
import ProductDetail from './components/products/ProductDetail';
import ProductForm from './components/products/ProductForm';

// Orders
import OrderList from './components/orders/OrderList';
import OrderDetail from './components/orders/OrderDetail';

// Payment
import Checkout from './components/payments/Checkout';
import PaymentSuccess from './components/payments/PaymentSuccess';
import PaymentFailed from './components/payments/PaymentFailed';

// Dashboard
import SellerDashboard from './components/dashboard/SellerDashboard';
import BuyerDashboard from './components/dashboard/BuyerDashboard';

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-gray-50">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Product Routes */}
            <Route path="/products" element={<ProductList />} />
            <Route path="/products/:id" element={<ProductDetail />} />
            
            {/* Protected Routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<BuyerDashboard />} />
              <Route path="/orders" element={<OrderList />} />
              <Route path="/orders/:id" element={<OrderDetail />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/payment-success" element={<PaymentSuccess />} />
              <Route path="/payment-failed" element={<PaymentFailed />} />
            </Route>
            
            {/* Seller Routes */}
            <Route element={<ProtectedRoute requiredRole="seller" />}>
              <Route path="/seller/dashboard" element={<SellerDashboard />} />
              <Route path="/seller/products/new" element={<ProductForm />} />
              <Route path="/seller/products/edit/:id" element={<ProductForm />} />
            </Route>
            
            {/* 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
        <ToastContainer position="top-right" autoClose={3000} />
      </div>
    </Router>
  );
}

export default App;
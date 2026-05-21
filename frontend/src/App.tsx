import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Cart from './pages/Cart';
import MyOrders from './pages/MyOrders';
import VendorDashboard from './pages/VendorDashboard';
import VendorProducts from './pages/VendorProducts';
import AdminPanel from './pages/AdminPanel';

const ProtectedRoute = ({ children, roles }: { children: React.ReactNode; roles?: string[] }) => {
  const { user, isLoading } = useAuth();
  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <div className="loader-spinner"></div>
      </div>
    );
  }
  if (!user) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/" replace />;
  return <>{children}</>;
};

const AppRoutes: React.FC = () => {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <main className="container" style={{ flex: 1, padding: '2rem 1rem' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/cart" element={<Cart />} />

          <Route path="/my-orders" element={
            <ProtectedRoute roles={['buyer']}>
              <MyOrders />
            </ProtectedRoute>
          } />

          <Route path="/vendor" element={
            <ProtectedRoute roles={['vendor']}>
              <VendorDashboard />
            </ProtectedRoute>
          } />

          <Route path="/vendor/products" element={
            <ProtectedRoute roles={['vendor']}>
              <VendorProducts />
            </ProtectedRoute>
          } />

          <Route path="/admin" element={
            <ProtectedRoute roles={['admin']}>
              <AdminPanel />
            </ProtectedRoute>
          } />
        </Routes>
      </main>

      <footer style={{
        borderTop: '1px solid var(--border-color)',
        padding: '2rem 1.5rem',
        background: 'rgba(13,17,23,0.9)',
        marginTop: '3rem',
      }}>
        <div style={{ maxWidth: '1240px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <p style={{ fontWeight: 800, fontSize: '1.1rem', marginBottom: '0.25rem' }}>
              Market<span style={{ background: 'var(--accent-gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Nexa</span>
            </p>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>Premium Multi-Vendor Marketplace</p>
          </div>
          <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            <span>21+ Products</span>
            <span>•</span>
            <span>2 Verified Vendors</span>
            <span>•</span>
            <span>Secure JWT Auth</span>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.75rem' }}>© 2026 MarketNexa. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <AppRoutes />
        </CartProvider>
      </AuthProvider>
    </Router>
  );
};

export default App;

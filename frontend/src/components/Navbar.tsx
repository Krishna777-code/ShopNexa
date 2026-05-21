import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingCart, LogOut, Store, LayoutDashboard, Package, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import styles from './Navbar.module.css';

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const { cart } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const cartItemsCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className={styles.navbar}>
      <div className={styles.navContainer}>
        {/* Logo */}
        <Link to="/" className={styles.logo} style={{ textDecoration: 'none' }}>
          <Store size={26} style={{ color: 'var(--accent-primary)' }} />
          <span>Market<span style={{ background: 'var(--accent-gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Nexa</span></span>
        </Link>

        {/* Nav Links */}
        <div className={styles.navLinks}>
          <Link to="/" className={styles.navLink} style={{ color: isActive('/') ? 'var(--accent-primary)' : undefined }}>
            Products
          </Link>

          {user?.role === 'buyer' && (
            <Link to="/my-orders" className={styles.navLink} style={{ color: isActive('/my-orders') ? 'var(--accent-primary)' : undefined }}>
              My Orders
            </Link>
          )}

          {user?.role === 'vendor' && (
            <>
              <Link to="/vendor" className={styles.navLink} style={{ display: 'flex', alignItems: 'center', gap: '4px', color: isActive('/vendor') ? 'var(--accent-primary)' : undefined }}>
                <LayoutDashboard size={15} /> Dashboard
              </Link>
              <Link to="/vendor/products" className={styles.navLink} style={{ display: 'flex', alignItems: 'center', gap: '4px', color: isActive('/vendor/products') ? 'var(--accent-primary)' : undefined }}>
                <Package size={15} /> Products
              </Link>
            </>
          )}

          {user?.role === 'admin' && (
            <Link to="/admin" className={styles.navLink} style={{ display: 'flex', alignItems: 'center', gap: '4px', color: isActive('/admin') ? 'var(--accent-primary)' : undefined }}>
              <Shield size={15} /> Admin
            </Link>
          )}

          {/* Cart icon (only for buyers / guests) */}
          {(!user || user.role === 'buyer') && (
            <Link to="/cart" className={styles.navLink} title="Cart">
              <div className={styles.cartIconWrapper}>
                <ShoppingCart size={22} />
                {cartItemsCount > 0 && <span className={styles.cartBadge}>{cartItemsCount}</span>}
              </div>
            </Link>
          )}

          {/* Auth section */}
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', borderLeft: '1px solid var(--border-color)', paddingLeft: '1rem', marginLeft: '0.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{
                  width: '32px', height: '32px', borderRadius: '50%',
                  background: 'var(--accent-gradient)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: 700, fontSize: '0.85rem', color: '#fff',
                  flexShrink: 0,
                }}>
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div style={{ lineHeight: 1.2 }}>
                  <p style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>{user.name}</p>
                  <p style={{ fontSize: '0.7rem', color: 'var(--accent-primary)', textTransform: 'capitalize' }}>{user.role}</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                title="Logout"
                style={{ background: 'none', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '0.4rem', color: 'var(--text-secondary)', cursor: 'pointer', display: 'flex', alignItems: 'center', transition: 'all 0.2s' }}
                onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--error)'; (e.currentTarget as HTMLButtonElement).style.color = 'var(--error)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--border-color)'; (e.currentTarget as HTMLButtonElement).style.color = 'var(--text-secondary)'; }}
              >
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', gap: '0.75rem', borderLeft: '1px solid var(--border-color)', paddingLeft: '1rem', marginLeft: '0.5rem' }}>
              <Link to="/login" className="btn btn-secondary" style={{ padding: '0.4rem 0.875rem', fontSize: '0.875rem' }}>Login</Link>
              <Link to="/register" className="btn btn-primary" style={{ padding: '0.4rem 0.875rem', fontSize: '0.875rem' }}>Sign Up</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

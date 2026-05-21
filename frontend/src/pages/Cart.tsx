import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth, api } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Trash2, ShoppingBag, CreditCard } from 'lucide-react';

const Cart: React.FC = () => {
  const { cart, removeFromCart, updateQuantity, clearCart, cartTotal } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');

  const handleCheckout = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    setProcessing(true);
    setError('');
    try {
      // Simulate payment delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      const itemsForBackend = cart.map(item => ({
        productId: item.productId,
        vendorId: item.vendorId,
        quantity: item.quantity,
        price: item.price
      }));

      await api.post('/orders', {
        items: itemsForBackend,
        totalAmount: cartTotal
      });

      clearCart();
      navigate('/my-orders');
    } catch (err: any) {
       setError(err.response?.data?.message || 'Checkout failed');
    } finally {
      setProcessing(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-secondary)' }}>
        <ShoppingBag size={64} style={{ margin: '0 auto 1.5rem', opacity: 0.5 }} />
        <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--text-primary)' }}>Your cart is empty</h2>
        <p style={{ marginBottom: '2rem' }}>Looks like you haven't added anything yet.</p>
        <button className="btn btn-primary" onClick={() => navigate('/')}>Continue Shopping</button>
      </div>
    );
  }

  return (
    <div>
      <h1 className="page-title">Shopping Cart</h1>
      {error && <div style={{ color: 'var(--error)', marginBottom: '1.5rem', backgroundColor: 'rgba(248, 81, 73, 0.1)', padding: '1rem', borderRadius: '8px' }}>{error}</div>}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '2rem', alignItems: 'start' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {cart.map((item) => (
            <div key={item.productId} className="glass-panel" style={{ display: 'flex', gap: '1.5rem', padding: '1.5rem', alignItems: 'center' }}>
              <div style={{ width: '80px', height: '80px', backgroundColor: 'var(--bg-surface)', borderRadius: '8px', backgroundImage: `url(${item.imageUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
              
              <div style={{ flex: 1 }}>
                <h3 style={{ fontSize: '1.1rem', marginBottom: '0.25rem' }}>{item.name}</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>${item.price.toFixed(2)} each</p>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', backgroundColor: 'var(--bg-surface)', borderRadius: '4px', overflow: 'hidden' }}>
                  <button 
                    style={{ background: 'none', border: 'none', padding: '0.5rem 0.75rem', color: 'var(--text-primary)', cursor: 'pointer' }}
                    onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                  >-</button>
                  <span style={{ padding: '0 0.5rem', minWidth: '30px', textAlign: 'center' }}>{item.quantity}</span>
                  <button 
                    style={{ background: 'none', border: 'none', padding: '0.5rem 0.75rem', color: 'var(--text-primary)', cursor: 'pointer' }}
                    onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                  >+</button>
                </div>

                <div style={{ fontWeight: 600, width: '80px', textAlign: 'right' }}>
                  ${(item.price * item.quantity).toFixed(2)}
                </div>

                <button 
                  onClick={() => removeFromCart(item.productId)}
                  style={{ background: 'none', border: 'none', color: 'var(--error)', cursor: 'pointer', padding: '0.5rem' }}
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="glass-panel" style={{ padding: '2rem', position: 'sticky', top: '100px' }}>
          <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>Order Summary</h2>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', color: 'var(--text-secondary)' }}>
            <span>Subtotal ({cart.reduce((a,c) => a + c.quantity, 0)} items)</span>
            <span>${cartTotal.toFixed(2)}</span>
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', color: 'var(--text-secondary)' }}>
            <span>Taxes & Fees (Calculated at checkout)</span>
            <span>$0.00</span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem', fontSize: '1.25rem', fontWeight: 700, borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
            <span>Total</span>
            <span style={{ color: 'var(--accent-primary)' }}>${cartTotal.toFixed(2)}</span>
          </div>

          <button 
            className="btn btn-primary" 
            style={{ width: '100%', padding: '1rem', fontSize: '1rem', display: 'flex', justifyContent: 'center', gap: '0.5rem' }}
            onClick={handleCheckout}
            disabled={processing}
          >
            {processing ? (
              <div className="loader-spinner" style={{ width: '20px', height: '20px', borderWidth: '2px' }} />
            ) : (
              <>
                <CreditCard size={20} />
                {user ? 'Proceed to Checkout' : 'Login to Checkout'}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;

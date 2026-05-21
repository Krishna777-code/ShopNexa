import React, { useEffect, useState } from 'react';
import { api } from '../context/AuthContext';
import { Package, Clock } from 'lucide-react';

interface OrderItem {
  productId: { _id: string; name: string; imageUrl?: string };
  quantity: number;
  price: number;
  vendorId: string;
}

interface Order {
  _id: string;
  items: OrderItem[];
  totalAmount: number;
  status: 'pending' | 'paid' | 'shipped' | 'delivered';
  createdAt: string;
}

const statusColors: Record<string, string> = {
  pending: 'var(--warning)',
  paid: 'var(--accent-primary)',
  shipped: '#bc8cff',
  delivered: 'var(--success)',
};

const MyOrders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await api.get('/orders/myorders');
        setOrders(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  if (loading) return <div className="loader-spinner" style={{ margin: '4rem auto' }}></div>;

  return (
    <div>
      <h1 className="page-title">My Orders</h1>

      {orders.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-secondary)' }}>
          <Package size={64} style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
          <h3>No orders yet.</h3>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {orders.map((order) => (
            <div key={order._id} className="glass-panel" style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <div>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Order ID</p>
                  <p style={{ fontFamily: 'monospace', fontSize: '0.9rem' }}>{order._id}</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>
                    <Clock size={12} style={{ display: 'inline', marginRight: '4px' }} />
                    {new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </p>
                  <span style={{
                    padding: '0.25rem 0.75rem',
                    borderRadius: '999px',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    backgroundColor: `${statusColors[order.status]}22`,
                    color: statusColors[order.status],
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>
                    {order.status}
                  </span>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
                {order.items.map((item, index) => (
                  <div key={index} style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <div style={{ width: '48px', height: '48px', borderRadius: '8px', backgroundColor: 'var(--bg-surface)', backgroundImage: `url(${item.productId?.imageUrl})`, backgroundSize: 'cover' }} />
                    <div style={{ flex: 1 }}>
                      <p style={{ fontWeight: 500 }}>{item.productId?.name || 'Product'}</p>
                      <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Qty: {item.quantity} × ${item.price.toFixed(2)}</p>
                    </div>
                    <span style={{ fontWeight: 600 }}>${(item.quantity * item.price).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1rem', display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', alignItems: 'center' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Total:</span>
                <span style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--accent-primary)' }}>${order.totalAmount.toFixed(2)}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyOrders;

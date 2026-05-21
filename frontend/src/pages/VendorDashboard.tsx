import React, { useEffect, useState } from 'react';
import { api } from '../context/AuthContext';
import { PackageOpen, DollarSign, ShoppingBag, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';

interface DashboardStats {
  totalProducts: number;
  totalSales: number;
  totalRevenue: number;
  recentOrders: any[];
}

const StatCard = ({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: string | number; color: string }) => (
  <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
    <div style={{ width: '52px', height: '52px', borderRadius: '12px', backgroundColor: `${color}22`, display: 'flex', alignItems: 'center', justifyContent: 'center', color }}>
      {icon}
    </div>
    <div>
      <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>{label}</p>
      <p style={{ fontSize: '1.75rem', fontWeight: 700 }}>{value}</p>
    </div>
  </div>
);

const VendorDashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await api.get('/vendor/dashboard');
        setStats(data);
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
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '2rem' }}>
        <h1 className="page-title" style={{ marginBottom: 0 }}>Vendor Dashboard</h1>
        <Link to="/vendor/products" className="btn btn-primary">Manage Products</Link>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        <StatCard icon={<PackageOpen size={24} />} label="Total Products" value={stats?.totalProducts ?? 0} color="var(--accent-primary)" />
        <StatCard icon={<ShoppingBag size={24} />} label="Total Units Sold" value={stats?.totalSales ?? 0} color="#bc8cff" />
        <StatCard icon={<DollarSign size={24} />} label="Total Revenue" value={`$${(stats?.totalRevenue ?? 0).toFixed(2)}`} color="var(--success)" />
        <StatCard icon={<TrendingUp size={24} />} label="Commission (10%)" value={`$${((stats?.totalRevenue ?? 0) * 0.1).toFixed(2)}`} color="var(--warning)" />
      </div>

      <div className="glass-panel" style={{ padding: '1.5rem' }}>
        <h2 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: '1.5rem' }}>Recent Orders Containing Your Products</h2>
        {(!stats?.recentOrders || stats.recentOrders.length === 0) ? (
          <p style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '2rem' }}>No orders yet.</p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)', textAlign: 'left' }}>
                <th style={{ paddingBottom: '0.75rem' }}>Order ID</th>
                <th style={{ paddingBottom: '0.75rem' }}>Total</th>
                <th style={{ paddingBottom: '0.75rem' }}>Status</th>
                <th style={{ paddingBottom: '0.75rem' }}>Date</th>
              </tr>
            </thead>
            <tbody>
              {stats.recentOrders.map((order) => (
                <tr key={order._id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '0.75rem 0', fontFamily: 'monospace', fontSize: '0.75rem' }}>{order._id}</td>
                  <td style={{ padding: '0.75rem 0', fontWeight: 600 }}>${order.totalAmount?.toFixed(2)}</td>
                  <td style={{ padding: '0.75rem 0' }}>
                    <span style={{ padding: '2px 8px', borderRadius: '4px', backgroundColor: 'var(--bg-surface)', fontSize: '0.75rem', textTransform: 'capitalize' }}>{order.status}</span>
                  </td>
                  <td style={{ padding: '0.75rem 0', color: 'var(--text-secondary)' }}>{new Date(order.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default VendorDashboard;

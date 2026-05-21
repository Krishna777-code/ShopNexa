import React, { useEffect, useState } from 'react';
import { api } from '../context/AuthContext';
import { Users, Package, ShoppingBag, DollarSign, Trash2 } from 'lucide-react';

interface AdminStats {
  totalVendors: number;
  totalBuyers: number;
  totalProducts: number;
  totalOrders: number;
  platformRevenue: number;
}

interface Vendor {
  _id: string;
  name: string;
  email: string;
  commissionRate: number;
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

const AdminPanel: React.FC = () => {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const [statsRes, vendorsRes] = await Promise.all([
        api.get('/admin/stats'),
        api.get('/admin/vendors'),
      ]);
      setStats(statsRes.data);
      setVendors(vendorsRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleRemoveVendor = async (id: string, name: string) => {
    if (!window.confirm(`Remove vendor "${name}" and all their products?`)) return;
    try {
      await api.delete(`/admin/vendors/${id}`);
      fetchData();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to remove vendor');
    }
  };

  if (loading) return <div className="loader-spinner" style={{ margin: '4rem auto' }}></div>;

  return (
    <div>
      <h1 className="page-title">Admin Panel</h1>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        <StatCard icon={<Users size={24} />} label="Total Vendors" value={stats?.totalVendors ?? 0} color="var(--accent-primary)" />
        <StatCard icon={<Users size={24} />} label="Total Buyers" value={stats?.totalBuyers ?? 0} color="#bc8cff" />
        <StatCard icon={<Package size={24} />} label="Total Products" value={stats?.totalProducts ?? 0} color="var(--warning)" />
        <StatCard icon={<ShoppingBag size={24} />} label="Total Orders" value={stats?.totalOrders ?? 0} color="var(--success)" />
        <StatCard icon={<DollarSign size={24} />} label="Platform Revenue (10%)" value={`$${(stats?.platformRevenue ?? 0).toFixed(2)}`} color="var(--success)" />
      </div>

      {/* Vendor Management */}
      <div className="glass-panel" style={{ padding: '1.5rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1.5rem' }}>Vendor Management</h2>

        {vendors.length === 0 ? (
          <p style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '2rem' }}>No vendors registered yet.</p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)', textAlign: 'left' }}>
                  <th style={{ paddingBottom: '0.75rem' }}>Name</th>
                  <th style={{ paddingBottom: '0.75rem' }}>Email</th>
                  <th style={{ paddingBottom: '0.75rem' }}>Commission</th>
                  <th style={{ paddingBottom: '0.75rem' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {vendors.map((vendor) => (
                  <tr key={vendor._id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '1rem 0' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--accent-gradient)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.85rem', fontWeight: 700, color: '#fff' }}>
                          {vendor.name.charAt(0).toUpperCase()}
                        </div>
                        {vendor.name}
                      </div>
                    </td>
                    <td style={{ padding: '1rem 0', color: 'var(--text-secondary)' }}>{vendor.email}</td>
                    <td style={{ padding: '1rem 0' }}>
                      <span style={{ color: 'var(--success)', fontWeight: 600 }}>{vendor.commissionRate ?? 10}%</span>
                    </td>
                    <td style={{ padding: '1rem 0' }}>
                      <button
                        className="btn btn-danger"
                        style={{ padding: '0.4rem 0.75rem', fontSize: '0.85rem' }}
                        onClick={() => handleRemoveVendor(vendor._id, vendor.name)}
                      >
                        <Trash2 size={14} style={{ marginRight: '4px' }} />
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;

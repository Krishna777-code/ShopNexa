import React, { useEffect, useState } from 'react';
import { api } from '../context/AuthContext';
import { Plus, Edit2, Trash2, X, Check } from 'lucide-react';

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  imageUrl?: string;
}

const EMPTY_FORM = { name: '', description: '', price: '', stock: '', category: '', imageUrl: '' };

const VendorProducts: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [error, setError] = useState('');

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/vendor/products');
      setProducts(data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchProducts(); }, []);

  const openAdd = () => { setEditingId(null); setFormData(EMPTY_FORM); setShowModal(true); setError(''); };
  const openEdit = (p: Product) => {
    setEditingId(p._id);
    setFormData({ name: p.name, description: p.description, price: String(p.price), stock: String(p.stock), category: p.category, imageUrl: p.imageUrl || '' });
    setShowModal(true);
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = { ...formData, price: parseFloat(formData.price), stock: parseInt(formData.stock) };
      if (editingId) {
        await api.put(`/products/${editingId}`, payload);
      } else {
        await api.post('/products', payload);
      }
      setShowModal(false);
      fetchProducts();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Operation failed');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this product?')) return;
    try {
      await api.delete(`/products/${id}`);
      fetchProducts();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Delete failed');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '2rem' }}>
        <h1 className="page-title" style={{ marginBottom: 0 }}>My Products</h1>
        <button className="btn btn-primary" onClick={openAdd} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Plus size={18} /> Add Product
        </button>
      </div>

      {loading ? (
        <div className="loader-spinner" style={{ margin: '4rem auto' }}></div>
      ) : (
        <div className="grid-container">
          {products.map((product) => (
            <div key={product._id} className="glass-panel" style={{ overflow: 'hidden' }}>
              <div style={{ height: '160px', backgroundColor: 'var(--bg-surface)', backgroundImage: `url(${product.imageUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
              <div style={{ padding: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '0.5rem' }}>
                  <h3 style={{ fontWeight: 600 }}>{product.name}</h3>
                  <span style={{ fontWeight: 700, color: 'var(--accent-primary)' }}>${product.price.toFixed(2)}</span>
                </div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '0.75rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{product.description}</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <span style={{ fontSize: '0.8rem', color: product.stock > 0 ? 'var(--success)' : 'var(--error)', backgroundColor: product.stock > 0 ? 'rgba(63,185,80,0.1)' : 'rgba(248,81,73,0.1)', padding: '2px 8px', borderRadius: '4px' }}>
                    {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                  </span>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', backgroundColor: 'var(--bg-surface)', padding: '2px 8px', borderRadius: '4px' }}>{product.category}</span>
                </div>
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <button className="btn btn-secondary" style={{ flex: 1 }} onClick={() => openEdit(product)}>
                    <Edit2 size={14} style={{ marginRight: '0.5rem' }} /> Edit
                  </button>
                  <button className="btn btn-danger" style={{ flex: 1 }} onClick={() => handleDelete(product._id)}>
                    <Trash2 size={14} style={{ marginRight: '0.5rem' }} /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {products.length === 0 && !loading && (
        <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-secondary)' }}>
          <h3>No products yet. Add your first product!</h3>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div style={{
          position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex',
          alignItems: 'center', justifyContent: 'center', zIndex: 200, backdropFilter: 'blur(4px)'
        }}>
          <div className="glass-panel" style={{ width: '95%', maxWidth: '520px', padding: '2rem', position: 'relative', maxHeight: '90vh', overflowY: 'auto' }}>
            <button onClick={() => setShowModal(false)} style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
              <X size={20} />
            </button>
            <h2 style={{ marginBottom: '1.5rem', fontWeight: 600 }}>{editingId ? 'Edit Product' : 'Add New Product'}</h2>
            {error && <div style={{ color: 'var(--error)', marginBottom: '1rem', background: 'rgba(248,81,73,0.1)', padding: '0.5rem', borderRadius: '4px' }}>{error}</div>}
            
            <form onSubmit={handleSubmit}>
              {[
                { name: 'name', label: 'Product Name', type: 'text', placeholder: 'e.g. Wireless Headphones' },
                { name: 'price', label: 'Price ($)', type: 'number', placeholder: '0.00' },
                { name: 'stock', label: 'Stock Quantity', type: 'number', placeholder: '0' },
                { name: 'category', label: 'Category', type: 'text', placeholder: 'Electronics, Clothing...' },
                { name: 'imageUrl', label: 'Image URL (optional)', type: 'url', placeholder: 'https://...' },
              ].map(field => (
                <div key={field.name} className="input-group">
                  <label className="input-label">{field.label}</label>
                  <input
                    type={field.type}
                    name={field.name}
                    className="input-field"
                    placeholder={field.placeholder}
                    value={(formData as any)[field.name]}
                    onChange={handleChange}
                    required={field.name !== 'imageUrl'}
                    min={field.type === 'number' ? '0' : undefined}
                    step={field.name === 'price' ? '0.01' : undefined}
                  />
                </div>
              ))}
              <div className="input-group">
                <label className="input-label">Description</label>
                <textarea name="description" className="input-field" placeholder="Describe your product..." value={formData.description} onChange={handleChange} required rows={3} style={{ resize: 'vertical' }} />
              </div>
              
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <button type="button" className="btn btn-secondary" style={{ flex: 1 }} onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" style={{ flex: 1, display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                  <Check size={18} /> {editingId ? 'Save Changes' : 'Add Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default VendorProducts;

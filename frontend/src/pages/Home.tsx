import React, { useEffect, useState } from 'react';
import { api } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { ShoppingCart, Star, Search, SlidersHorizontal, X, Check } from 'lucide-react';

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  imageUrl: string;
  category: string;
  rating: number;
  vendorId: { _id: string; name: string };
}

const CATEGORIES = ['All', 'Electronics', 'Fashion', 'Sports', 'Home', 'Furniture', 'Lifestyle'];

const Home: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filtered, setFiltered] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [sortBy, setSortBy] = useState('default');
  const [addedMap, setAddedMap] = useState<Record<string, boolean>>({});
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await api.get('/products');
        setProducts(data);
        setFiltered(data);
      } catch (err) {
        console.error('Failed to fetch products');
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    let result = [...products];
    if (activeCategory !== 'All') result = result.filter(p => p.category === activeCategory);
    if (search.trim()) result = result.filter(p =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase())
    );
    if (sortBy === 'price-asc') result.sort((a, b) => a.price - b.price);
    else if (sortBy === 'price-desc') result.sort((a, b) => b.price - a.price);
    else if (sortBy === 'rating') result.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
    setFiltered(result);
  }, [products, search, activeCategory, sortBy]);

  const handleAddToCart = (product: Product) => {
    addToCart({
      productId: product._id,
      vendorId: product.vendorId._id,
      name: product.name,
      price: product.price,
      quantity: 1,
      stock: product.stock,
      imageUrl: product.imageUrl,
    });
    setAddedMap(prev => ({ ...prev, [product._id]: true }));
    setTimeout(() => setAddedMap(prev => ({ ...prev, [product._id]: false })), 1800);
  };

  return (
    <div>
      {/* ── Hero Banner ── */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(88,166,255,0.15) 0%, rgba(188,140,255,0.15) 100%)',
        border: '1px solid rgba(88,166,255,0.2)',
        borderRadius: '16px',
        padding: '3.5rem 2.5rem',
        marginBottom: '2.5rem',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Background blobs */}
        <div style={{ position: 'absolute', top: '-60px', left: '-60px', width: '200px', height: '200px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(88,166,255,0.2) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '-60px', right: '-60px', width: '200px', height: '200px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(188,140,255,0.2) 0%, transparent 70%)', pointerEvents: 'none' }} />

        <p style={{ color: 'var(--accent-primary)', fontWeight: 600, fontSize: '0.9rem', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '1rem' }}>✦ Premium Multi-Vendor Marketplace</p>
        <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 800, marginBottom: '1rem', lineHeight: 1.15, background: 'linear-gradient(135deg, #c9d1d9, #58a6ff, #bc8cff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
          Shop From The Best Vendors
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', maxWidth: '540px', margin: '0 auto 2rem', lineHeight: 1.7 }}>
          Discover top-quality products from verified vendors — all in one beautifully curated marketplace.
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            <span style={{ color: 'var(--success)' }}>✓</span> 21+ Products
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            <span style={{ color: 'var(--success)' }}>✓</span> 2 Verified Vendors
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            <span style={{ color: 'var(--success)' }}>✓</span> Secure Checkout
          </div>
        </div>
      </div>

      {/* ── Search & Sort Bar ── */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: '1 1 260px' }}>
          <Search size={18} style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)', pointerEvents: 'none' }} />
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-field"
            style={{ paddingLeft: '2.75rem', width: '100%' }}
          />
          {search && (
            <button onClick={() => setSearch('')} style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', padding: '2px' }}>
              <X size={16} />
            </button>
          )}
        </div>

        <div style={{ position: 'relative', minWidth: '170px' }}>
          <SlidersHorizontal size={16} style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)', pointerEvents: 'none' }} />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="input-field"
            style={{ paddingLeft: '2.5rem', appearance: 'none', cursor: 'pointer', paddingRight: '1rem' }}
          >
            <option value="default">Sort: Default</option>
            <option value="price-asc">Price: Low → High</option>
            <option value="price-desc">Price: High → Low</option>
            <option value="rating">Top Rated</option>
          </select>
        </div>
      </div>

      {/* ── Category Chips ── */}
      <div style={{ display: 'flex', gap: '0.625rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            style={{
              padding: '0.4rem 1rem',
              borderRadius: '999px',
              border: activeCategory === cat ? 'none' : '1px solid var(--border-color)',
              background: activeCategory === cat ? 'var(--accent-gradient)' : 'var(--bg-surface)',
              color: activeCategory === cat ? '#fff' : 'var(--text-secondary)',
              fontWeight: activeCategory === cat ? 600 : 400,
              cursor: 'pointer',
              fontSize: '0.875rem',
              transition: 'all 0.2s',
              boxShadow: activeCategory === cat ? 'var(--shadow-glow)' : 'none',
            }}
          >
            {cat}
          </button>
        ))}
        <span style={{ marginLeft: 'auto', color: 'var(--text-secondary)', fontSize: '0.875rem', alignSelf: 'center' }}>
          {filtered.length} product{filtered.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* ── Product Grid ── */}
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}>
          <div className="loader-spinner" style={{ width: '40px', height: '40px', borderWidth: '4px' }}></div>
        </div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-secondary)' }}>
          <Search size={48} style={{ margin: '0 auto 1rem', opacity: 0.4 }} />
          <h3 style={{ color: 'var(--text-primary)', marginBottom: '0.5rem' }}>No products found</h3>
          <p>Try a different search term or category.</p>
        </div>
      ) : (
        <div className="grid-container">
          {filtered.map((product) => (
            <div
              key={product._id}
              className="glass-panel hover-lift"
              style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden', position: 'relative' }}
            >
              {/* Category Badge */}
              <span style={{
                position: 'absolute', top: '0.75rem', left: '0.75rem',
                backgroundColor: 'rgba(13,17,23,0.75)', backdropFilter: 'blur(6px)',
                color: 'var(--text-secondary)', fontSize: '0.7rem', fontWeight: 600,
                padding: '2px 8px', borderRadius: '999px', textTransform: 'uppercase', letterSpacing: '0.5px', zIndex: 1,
              }}>
                {product.category}
              </span>

              {/* Out-of-stock badge */}
              {product.stock === 0 && (
                <span style={{ position: 'absolute', top: '0.75rem', right: '0.75rem', backgroundColor: 'rgba(248,81,73,0.85)', color: '#fff', fontSize: '0.7rem', fontWeight: 600, padding: '2px 8px', borderRadius: '999px', zIndex: 1 }}>
                  Out of Stock
                </span>
              )}

              {/* Image */}
              <div style={{
                height: '210px',
                backgroundColor: 'var(--bg-surface)',
                backgroundImage: `url(${product.imageUrl || 'https://images.unsplash.com/photo-1560343090-f0409e92791a?w=600&q=80'})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                transition: 'transform 0.4s ease',
              }} />

              {/* Content */}
              <div style={{ padding: '1.25rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem' }}>
                  <h3 style={{ fontSize: '1rem', fontWeight: 600, lineHeight: 1.3, flex: 1 }}>{product.name}</h3>
                  <span style={{ fontWeight: 700, color: 'var(--accent-primary)', fontSize: '1.1rem', whiteSpace: 'nowrap' }}>
                    ${product.price.toFixed(2)}
                  </span>
                </div>

                <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {product.description}
                </p>

                {/* Rating + Vendor */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.25rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#f0c040' }}>
                    {[1, 2, 3, 4, 5].map(i => (
                      <Star key={i} size={12} fill={i <= Math.round(product.rating ?? 4) ? 'currentColor' : 'none'} />
                    ))}
                    <span style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', marginLeft: '2px' }}>{product.rating ?? '4.5'}</span>
                  </div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                    by <strong style={{ color: 'var(--text-primary)' }}>{product.vendorId?.name}</strong>
                  </span>
                </div>

                {/* Stock bar */}
                <div style={{ marginTop: '0.25rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                    <span>Stock</span>
                    <span>{product.stock} left</span>
                  </div>
                  <div style={{ height: '4px', backgroundColor: 'var(--bg-surface)', borderRadius: '2px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${Math.min((product.stock / 100) * 100, 100)}%`, background: product.stock < 15 ? 'var(--error)' : 'var(--accent-gradient)', borderRadius: '2px', transition: 'width 0.4s ease' }} />
                  </div>
                </div>

                {/* Add to cart button */}
                <button
                  className="btn btn-primary"
                  style={{ marginTop: '0.75rem', width: '100%', gap: '0.5rem', opacity: product.stock === 0 ? 0.5 : 1 }}
                  disabled={product.stock === 0}
                  onClick={() => handleAddToCart(product)}
                >
                  {addedMap[product._id] ? (
                    <><Check size={18} /> Added!</>
                  ) : (
                    <><ShoppingCart size={18} /> Add to Cart</>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;

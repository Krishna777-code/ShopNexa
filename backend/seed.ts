import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import User from './src/models/User';
import Product from './src/models/Product';
import Order from './src/models/Order';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/marketplace';

const products = [
  // Electronics
  {
    name: 'Wireless Noise-Cancelling Headphones',
    description: 'Premium over-ear headphones with 30hr battery life, deep bass, and crystal-clear audio for an immersive listening experience.',
    price: 149.99, stock: 25, category: 'Electronics', rating: 4.7,
    imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80',
  },
  {
    name: 'Mechanical Keyboard Pro',
    description: 'RGB backlit mechanical keyboard with tactile switches, anti-ghosting, and aluminum frame. Perfect for gaming and coding.',
    price: 89.99, stock: 40, category: 'Electronics', rating: 4.5,
    imageUrl: 'https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?w=600&q=80',
  },
  {
    name: 'Portable Bluetooth Speaker',
    description: '360° surround sound, IPX7 waterproof, 20-hour battery. Your perfect adventure companion.',
    price: 59.99, stock: 60, category: 'Electronics', rating: 4.4,
    imageUrl: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600&q=80',
  },
  {
    name: 'Smart Home Security Camera',
    description: '4K resolution, AI motion detection, night vision, and 2-way audio. Keep your home safe 24/7.',
    price: 79.99, stock: 20, category: 'Electronics', rating: 4.3,
    imageUrl: 'https://images.unsplash.com/photo-1582139329536-e7284fece509?w=600&q=80',
  },
  {
    name: '4K Ultra HD Monitor 27"',
    description: 'IPS display with 144Hz refresh rate, 1ms response time, HDR400, and USB-C connectivity. Stunning visuals for work and play.',
    price: 349.99, stock: 15, category: 'Electronics', rating: 4.8,
    imageUrl: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=600&q=80',
  },
  {
    name: 'True Wireless Earbuds',
    description: 'Active noise cancellation, 8hr playtime + 24hr case, wireless charging, IPX4 splash resistant.',
    price: 99.99, stock: 50, category: 'Electronics', rating: 4.6,
    imageUrl: 'https://images.unsplash.com/photo-1572536147248-ac59a8abfa4b?w=600&q=80',
  },
  {
    name: 'Smartphone Stand & Wireless Charger',
    description: '15W fast wireless charging pad with adjustable stand. Compatible with all Qi-enabled devices.',
    price: 39.99, stock: 80, category: 'Electronics', rating: 4.2,
    imageUrl: 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=600&q=80',
  },
  // Fashion
  {
    name: 'Minimalist Leather Watch',
    description: 'Italian leather strap with sapphire crystal glass and Swiss quartz movement. Timeless elegance for every occasion.',
    price: 210.00, stock: 15, category: 'Fashion', rating: 4.9,
    imageUrl: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=600&q=80',
  },
  {
    name: 'Premium Leather Wallet',
    description: 'Genuine full-grain leather, RFID blocking, 8 card slots, slim profile. The last wallet you will ever buy.',
    price: 49.99, stock: 70, category: 'Fashion', rating: 4.7,
    imageUrl: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=600&q=80',
  },
  {
    name: 'Classic Aviator Sunglasses',
    description: 'UV400 polarized lenses with gold metal frame. Iconic style that never goes out of fashion.',
    price: 74.99, stock: 45, category: 'Fashion', rating: 4.5,
    imageUrl: 'https://images.unsplash.com/photo-1473496169904-658ba7574b0d?w=600&q=80',
  },
  // Sports
  {
    name: 'Running Sneakers Ultra',
    description: 'Lightweight mesh upper with responsive cushioning sole. Engineered for speed and comfort on any terrain.',
    price: 119.99, stock: 35, category: 'Sports', rating: 4.6,
    imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80',
  },
  {
    name: 'Adjustable Dumbbell Set',
    description: 'All-in-one adjustable dumbbell replaces 15 weights. 5–52.5 lb range with quick-select dial.',
    price: 259.99, stock: 12, category: 'Sports', rating: 4.9,
    imageUrl: 'https://images.unsplash.com/photo-1586401100295-7a8096fd231a?w=600&q=80',
  },
  {
    name: 'Yoga Mat Premium',
    description: 'Extra-thick 6mm non-slip mat with alignment lines, carry strap, and sweat-absorbing surface.',
    price: 44.99, stock: 55, category: 'Sports', rating: 4.6,
    imageUrl: 'https://images.unsplash.com/photo-1601925228869-9ddc93c24a50?w=600&q=80',
  },
  {
    name: 'Smart Fitness Band',
    description: 'Heart rate, SpO2, sleep tracking, 14-day battery, 50m waterproof. Your always-on health companion.',
    price: 69.99, stock: 40, category: 'Sports', rating: 4.4,
    imageUrl: 'https://images.unsplash.com/photo-1557166983-5939644443b3?w=600&q=80',
  },
  // Home & Furniture
  {
    name: 'Ergonomic Office Chair',
    description: 'Lumbar support, adjustable armrests, breathable mesh back. Work comfortably for hours without strain.',
    price: 299.99, stock: 10, category: 'Furniture', rating: 4.8,
    imageUrl: 'https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?w=600&q=80',
  },
  {
    name: 'LED Desk Lamp with USB Charger',
    description: 'Touch-dimming, 5 color temperatures, USB-A charging port, and eye-care flicker-free lighting.',
    price: 45.99, stock: 65, category: 'Home', rating: 4.5,
    imageUrl: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=600&q=80',
  },
  {
    name: 'Ceramic Pour-Over Coffee Set',
    description: 'Handcrafted ceramic dripper, server, and two mugs. Brew barista-quality coffee at home every morning.',
    price: 55.00, stock: 30, category: 'Home', rating: 4.7,
    imageUrl: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&q=80',
  },
  // Lifestyle
  {
    name: 'Stainless Steel Water Bottle',
    description: 'Triple-wall insulation keeps drinks cold 24hrs or hot 12hrs. 1L capacity, BPA-free, dishwasher safe.',
    price: 34.99, stock: 100, category: 'Lifestyle', rating: 4.7,
    imageUrl: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=600&q=80',
  },
  {
    name: 'Hardcover Dot-Grid Journal',
    description: '240 pages of premium 100gsm dot-grid paper, lay-flat binding, ribbon bookmark, and elastic closure.',
    price: 22.99, stock: 120, category: 'Lifestyle', rating: 4.8,
    imageUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&q=80',
  },
  {
    name: 'Aromatherapy Diffuser',
    description: '400ml ultrasonic diffuser with 8Hr continuous mist, 7-color ambient light, and whisper-quiet operation.',
    price: 32.99, stock: 75, category: 'Lifestyle', rating: 4.5,
    imageUrl: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=600&q=80',
  },
  // Bonus - makes 21
  {
    name: 'Portable Solar Power Bank',
    description: '26,800mAh capacity with dual solar panels, 3 USB outputs, LED flashlight. Stay charged anywhere.',
    price: 52.99, stock: 35, category: 'Electronics', rating: 4.3,
    imageUrl: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=600&q=80',
  },
];

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clean existing data
    await Promise.all([User.deleteMany({}), Product.deleteMany({}), Order.deleteMany({})]);
    console.log('Cleared existing data');

    // Create admin
    const adminPassword = await bcrypt.hash('admin123', 10);
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@marketnexa.com',
      password: adminPassword,
      role: 'admin',
    });

    // Create vendor 1
    const vendorPassword = await bcrypt.hash('vendor123', 10);
    const vendor = await User.create({
      name: 'TechStore Pro',
      email: 'vendor@marketnexa.com',
      password: vendorPassword,
      role: 'vendor',
      commissionRate: 10,
    });

    // Create vendor 2
    const vendor2Password = await bcrypt.hash('vendor123', 10);
    const vendor2 = await User.create({
      name: 'StyleHub',
      email: 'vendor2@marketnexa.com',
      password: vendor2Password,
      role: 'vendor',
      commissionRate: 12,
    });

    // Create buyer
    const buyerPassword = await bcrypt.hash('buyer123', 10);
    await User.create({
      name: 'John Buyer',
      email: 'buyer@marketnexa.com',
      password: buyerPassword,
      role: 'buyer',
    });

    // Distribute products between 2 vendors
    const vendorIds = [vendor._id, vendor2._id];
    const createdProducts = await Promise.all(
      products.map((p, i) =>
        Product.create({ ...p, vendorId: vendorIds[i % 2] })
      )
    );

    console.log(`✅ Created ${createdProducts.length} products across 2 vendors`);
    console.log('\n🔑 Demo accounts:');
    console.log('  Admin   → admin@marketnexa.com   / admin123');
    console.log('  Vendor1 → vendor@marketnexa.com  / vendor123');
    console.log('  Vendor2 → vendor2@marketnexa.com / vendor123');
    console.log('  Buyer   → buyer@marketnexa.com   / buyer123');

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('Seed error:', err);
    process.exit(1);
  }
}

seed();

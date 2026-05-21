import express, { Request, Response } from 'express';
import { authenticate, authorizeRole } from '../middleware/auth';
import Product from '../models/Product';
import Order from '../models/Order';
import mongoose from 'mongoose';

const router = express.Router();

// Get vendor dashboard stats
router.get('/dashboard', authenticate, authorizeRole(['vendor']), async (req: any, res: Response) => {
  try {
    const vendorId = req.user.userId;

    // Total products
    const totalProducts = await Product.countDocuments({ vendorId });

    // Find orders that contain vendor's products
    // Note: This matches any order that has at least one item from the vendor
    const orders = await Order.find({ 'items.vendorId': vendorId });

    let totalRevenue = 0;
    let totalSales = 0;

    orders.forEach(order => {
      order.items.forEach(item => {
        if (item.vendorId.toString() === vendorId) {
          totalRevenue += item.price * item.quantity;
          totalSales += item.quantity;
        }
      });
    });

    res.json({
      totalProducts,
      totalSales,
      totalRevenue,
      recentOrders: orders.slice(0, 5) // Send some recent orders
    });

  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all products for a vendor
router.get('/products', authenticate, authorizeRole(['vendor']), async (req: any, res: Response) => {
  try {
     const products = await Product.find({ vendorId: req.user.userId });
     res.json(products);
  } catch (err) {
      res.status(500).json({ message: 'Server error' });
  }
});

export default router;

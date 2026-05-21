import express, { Request, Response } from 'express';
import { authenticate, authorizeRole } from '../middleware/auth';
import User from '../models/User';
import Order from '../models/Order';
import Product from '../models/Product';

const router = express.Router();

router.get('/stats', authenticate, authorizeRole(['admin']), async (req: Request, res: Response) => {
  try {
    const totalVendors = await User.countDocuments({ role: 'vendor' });
    const totalBuyers = await User.countDocuments({ role: 'buyer' });
    const totalProducts = await Product.countDocuments();
    const totalOrders = await Order.countDocuments();

    // Calculate generic platform revenue (commission based) - simple example
    const orders = await Order.find();
    let platformRevenue = 0;
    
    // For simplicity, platform takes flat 10% commission on total sales
    orders.forEach(order => {
       platformRevenue += order.totalAmount * 0.10;
    });

    res.json({
      totalVendors,
      totalBuyers,
      totalProducts,
      totalOrders,
      platformRevenue
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/vendors', authenticate, authorizeRole(['admin']), async (req: Request, res: Response) => {
  try {
    const vendors = await User.find({ role: 'vendor' }).select('-password');
    res.json(vendors);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Moderation: block or delete vendor
router.delete('/vendors/:id', authenticate, authorizeRole(['admin']), async (req: Request, res: Response) => {
  try {
     const vendor = await User.findById(req.params.id);
     if(vendor && vendor.role === 'vendor') {
         await User.findByIdAndDelete(req.params.id);
         // Optionally delete their products too
         await Product.deleteMany({ vendorId: req.params.id });
         res.json({ message: 'Vendor removed and products deleted' });
     } else {
         res.status(404).json({ message: 'Vendor not found' });
     }
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;

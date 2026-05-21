import express, { Request, Response } from 'express';
import Order from '../models/Order';
import Product from '../models/Product';
import { authenticate } from '../middleware/auth';

const router = express.Router();

// Create new order (buyer)
router.post('/', authenticate, async (req: any, res: Response) => {
  try {
    const { items, totalAmount } = req.body;

    if (items && items.length === 0) {
      return res.status(400).json({ message: 'No order items' });
    }

    // Deduct stock for each item
    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product) {
         return res.status(404).json({ message: `Product ${item.productId} not found` });
      }
      if (product.stock < item.quantity) {
        return res.status(400).json({ message: `Insufficient stock for ${product.name}` });
      }
      product.stock -= item.quantity;
      await product.save();
    }

    const order = new Order({
      buyerId: req.user.userId,
      items,
      totalAmount,
    });

    const savedOrder = await order.save();
    res.status(201).json(savedOrder);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user orders (buyers)
router.get('/myorders', authenticate, async (req: any, res: Response) => {
  try {
    const orders = await Order.find({ buyerId: req.user.userId }).populate('items.productId');
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update order status (vendor - normally only for items they own, but for simplicity, allow if it affects them)
// In a fully robust multi-vendor system, orders should be split per vendor or the status tracked per item.
// Here we just allow vendors to see orders containing their products.

export default router;

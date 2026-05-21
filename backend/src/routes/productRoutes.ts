import express, { Request, Response } from 'express';
import Product from '../models/Product';
import { authenticate, authorizeRole } from '../middleware/auth';

const router = express.Router();

// Get all products (buyers)
router.get('/', async (req: Request, res: Response) => {
  try {
    const products = await Product.find().populate('vendorId', 'name email');
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single product
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const product = await Product.findById(req.params.id).populate('vendorId', 'name email');
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create product (vendors only)
router.post('/', authenticate, authorizeRole(['vendor']), async (req: any, res: Response) => {
  try {
    const { name, description, price, stock, category, imageUrl } = req.body;

    const newProduct = new Product({
      vendorId: req.user.userId,
      name,
      description,
      price,
      stock,
      category,
      imageUrl,
    });

    const product = await newProduct.save();
    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update product (vendor only, own products)
router.put('/:id', authenticate, authorizeRole(['vendor']), async (req: any, res: Response) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    if (product.vendorId.toString() !== req.user.userId) {
      return res.status(401).json({ message: 'User not authorized' });
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );

    res.json(updatedProduct);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete product (vendor only, own products)
router.delete('/:id', authenticate, authorizeRole(['vendor']), async (req: any, res: Response) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    if (product.vendorId.toString() !== req.user.userId) {
      return res.status(401).json({ message: 'User not authorized' });
    }

    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: 'Product removed' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;

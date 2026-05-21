import mongoose, { Schema, Document } from 'mongoose';

export interface IProduct extends Document {
  vendorId: mongoose.Types.ObjectId;
  name: string;
  description: string;
  price: number;
  stock: number;
  imageUrl?: string;
  category: string;
  rating?: number; // Optional rating out of 5
}

const ProductSchema: Schema = new Schema({
  vendorId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  stock: { type: Number, required: true, default: 0 },
  imageUrl: { type: String },
  category: { type: String, required: true },
  rating: { type: Number, default: 0 },
}, { timestamps: true });

export default mongoose.model<IProduct>('Product', ProductSchema);

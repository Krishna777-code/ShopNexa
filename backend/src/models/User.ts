import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  role: 'buyer' | 'vendor' | 'admin';
  commissionRate?: number; // Optional: custom commission rate for vendors
}

const UserSchema: Schema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['buyer', 'vendor', 'admin'], default: 'buyer' },
  commissionRate: { type: Number, default: 10 }, // Default 10% commission
});

export default mongoose.model<IUser>('User', UserSchema);

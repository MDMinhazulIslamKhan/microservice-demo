import { Schema, model } from 'mongoose';
import { IProduct, ProductModel } from './product.interface';

const ProductSchema = new Schema<IProduct, ProductModel>(
  {
    name: {
      type: String,
      index: true,
      required: [true, 'Product name is required.'],
      maxLength: [50, 'Invalid product name.'],
    },
    description: {
      type: String,
      required: [true, 'Product description is required.'],
      maxLength: [1000, 'Invalid product description.'],
    },
    price: {
      type: Number,
      required: true,
      min: [0, 'Price can not be negative.'],
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      required: false,
      ref: 'User',
    },
    updatedBy: {
      type: Schema.Types.ObjectId,
      required: false,
      ref: 'User',
    },
    isActive: { type: Boolean, required: true, default: true },
  },
  {
    timestamps: true,
  }
);

export const Product = model<IProduct, ProductModel>('Product', ProductSchema);

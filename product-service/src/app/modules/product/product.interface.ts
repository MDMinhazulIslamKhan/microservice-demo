import { Model, Types } from 'mongoose';

export type IProduct = {
  _id: Types.ObjectId;
  syncId: string;
  name: string;
  description: string;
  price: number;
  isActive: boolean;
  createdBy: Types.ObjectId;
  updatedBy: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
};

/**
 * @ignore
 */
export type ProductModel = Model<IProduct, Record<string, unknown>>;

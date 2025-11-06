import { UserInfoFromToken } from '../../../interfaces/common';
import { IProduct } from './product.interface';
import { Product } from './product.model';

const createProduct = async (
  payload: IProduct,
  userInfo: UserInfoFromToken
) => {};

const allProducts = async () => {
  return await Product.find();
};

const updateProduct = async (
  payload: IProduct,
  userInfo: UserInfoFromToken
) => {};

export const ProductService = {
  createProduct,
  allProducts,
  updateProduct,
};

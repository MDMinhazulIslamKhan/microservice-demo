import ApiError from '../../../errors/ApiError';
import { UserInfoFromToken } from '../../../interfaces/common';
import { User } from '../users/user.model';
import { ProductEvents } from './product.events';
import { IProduct } from './product.interface';
import { Product } from './product.model';

const createProduct = async (
  payload: Partial<IProduct>,
  userInfo: UserInfoFromToken
) => {
  const checkAdmin = await User.findOne({ syncId: userInfo.id });

  if (!checkAdmin || checkAdmin.role !== 'ADMIN') {
    throw new ApiError(401, 'You are not authorized.');
  }

  const result = await Product.create({
    ...payload,
    createdBy: checkAdmin._id,
    updatedBy: checkAdmin._id,
  });

  if (!result) {
    throw new ApiError(500, 'Something went wrong');
  }

  await ProductEvents.publishProductCreated({
    id: result._id.toString(),
    name: result.name,
    price: result.price,
    isActive: result.isActive,
  });

  return {
    _id: result._id,
    name: result.name,
    description: result.description,
    price: result.price,
  };
};

const allProducts = async () => {
  return await Product.find(
    {
      isActive: true,
    },
    { name: 1, price: 1, description: 1 }
  );
};

const updateProduct = async (
  payload: IProduct,
  userInfo: UserInfoFromToken,
  productId: string
) => {
  const checkAdmin = await User.findOne({ syncId: userInfo.id });

  if (!checkAdmin || checkAdmin.role !== 'ADMIN') {
    throw new ApiError(401, 'You are not authorized.');
  }

  const updatedProduct = await Product.findByIdAndUpdate(
    productId,
    {
      $set: { ...payload, updatedBy: checkAdmin._id },
    },
    { new: true }
  );

  if (!updatedProduct) {
    throw new ApiError(500, 'Something went wrong');
  }

  await ProductEvents.publishProductUpdated({
    id: updatedProduct._id.toString(),
    name: updatedProduct.name,
    price: updatedProduct.price,
    isActive: updatedProduct.isActive,
  });

  return {
    _id: updatedProduct._id,
    name: updatedProduct.name,
    description: updatedProduct.description,
    price: updatedProduct.price,
  };
};
const productDetails = async (productId: string) => {
  return await Product.findById(productId);
};

export const ProductService = {
  createProduct,
  allProducts,
  updateProduct,
  productDetails,
};

import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { ProductService } from './product.service';
import { UserInfoFromToken } from '../../../interfaces/common';

const createProduct = catchAsync(async (req: Request, res: Response) => {
  const result = await ProductService.createProduct(
    req.body,
    req.user as UserInfoFromToken
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Product created successfully!',
    data: result,
  });
});

const allProducts = catchAsync(async (req: Request, res: Response) => {
  const result = await ProductService.allProducts();

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'All product fetched successfully!',
    data: result,
  });
});

const updateProduct = catchAsync(async (req: Request, res: Response) => {
  const result = await ProductService.updateProduct(
    req.body,
    req.user as UserInfoFromToken,
    req.params.productId
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Product updated successfully!',
    data: result,
  });
});

const productDetails = catchAsync(async (req: Request, res: Response) => {
  const result = await ProductService.productDetails(req.params.productId);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Product details fetched successfully!',
    data: result,
  });
});

export const ProductController = {
  createProduct,
  allProducts,
  updateProduct,
  productDetails,
};

import express from 'express';
import validateRequest from '../../middleware/validateRequest';
import userContext from '../../middleware/userContext';
import { ENUM_USER_ROLE } from '../../../enums';
import { ProductValidation } from './product.validation';
import { ProductController } from './product.controller';

const router = express.Router();

router.post(
  '/create-product',
  userContext(ENUM_USER_ROLE.ADMIN),
  validateRequest(ProductValidation.createProductZodSchema),
  ProductController.createProduct
);

router.post('/all-products', ProductController.allProducts);

router.post(
  '/update-product/:productId',
  userContext(ENUM_USER_ROLE.ADMIN),
  validateRequest(ProductValidation.updateProductZodSchema),
  ProductController.updateProduct
);

export const ProductRoutes = router;

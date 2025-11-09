import express from 'express';
import { OrderController } from './order.controller';
import userContext from '../../middleware/userContext';
import { ENUM_USER_ROLE } from '../../../enums';
import { OrderValidation } from './order.validation';
import validateRequest from '../../middleware/validateRequest';

const router = express.Router();

router.post(
  '/',
  validateRequest(OrderValidation.createOrderZodSchema),
  userContext(),
  OrderController.createOrder
);

router.get('/orders', userContext(), OrderController.allOrders);

router.get(
  '/all-orders',
  userContext(ENUM_USER_ROLE.ADMIN),
  OrderController.allOrdersAdmin
);

router.get(
  '/single-order/:orderId',
  userContext(),
  OrderController.singleOrder
);

router.patch(
  '/update-status',
  userContext(ENUM_USER_ROLE.ADMIN),
  validateRequest(OrderValidation.updateStatusZodSchema),
  OrderController.updateOrderStatus
);

export const OrderRoutes = router;

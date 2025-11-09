import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { OrderService } from './order.service';
import { UserInfoFromToken } from '../../../interfaces/common';

const createOrder = catchAsync(async (req: Request, res: Response) => {
  const result = await OrderService.createOrder(
    req.body,
    req.user as UserInfoFromToken
  );

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'Order created successfully.',
    data: result,
  });
});

const allOrdersAdmin = catchAsync(async (req: Request, res: Response) => {
  const result = await OrderService.allOrdersAdmin(
    req.user as UserInfoFromToken
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'All orders fetched successfully.',
    data: result,
  });
});

const allOrders = catchAsync(async (req: Request, res: Response) => {
  const result = await OrderService.allOrders(req.user as UserInfoFromToken);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'All orders fetched successfully.',
    data: result,
  });
});

const singleOrder = catchAsync(async (req: Request, res: Response) => {
  const result = await OrderService.singleOrder(
    req.params.orderId,
    req.user as UserInfoFromToken
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Order details fetched successfully.',
    data: result,
  });
});

const updateOrderStatus = catchAsync(async (req: Request, res: Response) => {
  const result = await OrderService.updateOrderStatus(
    req.body,
    req.user as UserInfoFromToken
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Status updated successfully.',
    data: result,
  });
});

export const OrderController = {
  createOrder,
  allOrders,
  allOrdersAdmin,
  singleOrder,
  updateOrderStatus,
};

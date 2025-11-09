import prisma from '../../../shared/prisma';
import { UserInfoFromToken } from '../../../interfaces/common';
import ApiError from '../../../errors/ApiError';
import { OrderStatus, UserRoles } from '@prisma/client';
import { validTransitions } from './order.utils';

const createOrder = async (
  order: {
    productId: string;
    quantity: number;
  },
  userInfo: UserInfoFromToken
) => {
  const checkUser = await prisma.user.findUnique({
    where: { syncId: userInfo.id },
  });

  const checkProduct = await prisma.product.findUnique({
    where: { syncId: order.productId },
  });

  if (!checkUser) {
    throw new ApiError(404, "User doesn't exist.");
  }

  if (!checkProduct) {
    throw new ApiError(404, "Product doesn't exist.");
  }

  await prisma.order.create({
    data: {
      productId: checkProduct.productId,
      userId: checkUser.userId,
      quantity: order.quantity,
      totalPrice: checkProduct.price.mul(order.quantity),
    },
  });
};

const allOrders = async (userInfo: UserInfoFromToken) => {
  const data = await prisma.order.findMany({
    where: { userId: userInfo.id },
    select: {
      product: {
        select: {
          name: true,
          syncId: true,
        },
      },
      quantity: true,
      totalPrice: true,
      orderId: true,
      orderStatus: true,
    },
  });
  const formattedData = data.map(order => ({
    productId: order.product.syncId,
    name: order.product.name,
    quantity: order.quantity,
    totalPrice: order.totalPrice,
    orderId: order.orderId,
    orderStatus: order.orderStatus,
  }));

  return formattedData;
};

const allOrdersAdmin = async (adminInfo: UserInfoFromToken) => {
  const checkAdmin = await prisma.user.findUnique({
    where: { syncId: adminInfo.id },
  });

  if (!checkAdmin || checkAdmin.role !== UserRoles.ADMIN) {
    throw new ApiError(401, "You don't have access.");
  }

  const data = await prisma.order.findMany({
    select: {
      product: {
        select: {
          name: true,
          syncId: true,
        },
      },
      quantity: true,
      totalPrice: true,
      orderId: true,
      orderStatus: true,
    },
  });

  const formattedData = data.map(order => ({
    productId: order.product.syncId,
    name: order.product.name,
    quantity: order.quantity,
    totalPrice: order.totalPrice,
    orderId: order.orderId,
    orderStatus: order.orderStatus,
  }));

  return formattedData;
};

const singleOrder = async (orderId: string, userInfo: UserInfoFromToken) => {
  const checkOrder = await prisma.order.findUnique({
    where: { orderId },
    select: {
      product: {
        select: {
          name: true,
          syncId: true,
        },
      },
      user: {
        select: {
          name: true,
          syncId: true,
        },
      },
      quantity: true,
      totalPrice: true,
      orderId: true,
      orderStatus: true,
      userId: true,
    },
  });

  const checkUser = await prisma.user.findUnique({
    where: { syncId: userInfo.id },
  });

  if (
    !checkUser ||
    checkUser.role !== UserRoles.ADMIN ||
    checkOrder?.userId !== checkUser.syncId
  ) {
    throw new ApiError(401, "You don't have access.");
  }

  return {
    productId: checkOrder.product.syncId,
    name: checkOrder.product.name,
    user: checkOrder.user.name,
    userId: checkOrder.user.syncId,
    quantity: checkOrder.quantity,
    totalPrice: checkOrder.totalPrice,
    orderId: checkOrder.orderId,
    orderStatus: checkOrder.orderStatus,
  };
};
const updateOrderStatus = async (
  payload: { orderId: string; status: OrderStatus },
  adminInfo: UserInfoFromToken
) => {
  const checkOrder = await prisma.order.findUnique({
    where: { orderId: payload.orderId },
    select: {
      product: {
        select: {
          name: true,
          syncId: true,
        },
      },
      user: {
        select: {
          name: true,
          syncId: true,
        },
      },
      quantity: true,
      totalPrice: true,
      orderId: true,
      orderStatus: true,
      userId: true,
    },
  });

  const checkUser = await prisma.user.findUnique({
    where: { syncId: adminInfo.id },
  });

  if (!checkUser || checkUser.role !== UserRoles.ADMIN) {
    throw new ApiError(401, "You don't have access.");
  }

  if (!checkOrder) {
    throw new ApiError(404, 'Order not exist.');
  }

  const allowedNext = validTransitions[checkOrder.orderStatus];

  if (!allowedNext.includes(payload.status)) {
    throw new ApiError(
      400,
      `Invalid status transition: cannot move from ${checkOrder.orderStatus} to ${payload.status}.`
    );
  }
};

export const OrderService = {
  createOrder,
  allOrders,
  allOrdersAdmin,
  singleOrder,
  updateOrderStatus,
};

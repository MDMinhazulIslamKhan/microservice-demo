import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { AdminService } from './admin.service';

const allUsers = catchAsync(async (req: Request, res: Response) => {
  const result = await AdminService.allUsers();

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'All users fetched successfully.',
    data: result,
  });
});

const userDetails = catchAsync(async (req: Request, res: Response) => {
  const result = await AdminService.userDetails(req.params.userId);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'User details fetched successfully.',
    data: result,
  });
});

const createAdmin = catchAsync(async (req: Request, res: Response) => {
  const result = await AdminService.createAdmin(req.params.userId);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Admin created successfully.',
    data: result,
  });
});

export const AdminController = {
  allUsers,
  userDetails,
  createAdmin,
};

import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { UserService } from './user.service';
import { UserInfoFromToken } from '../../../interfaces/common';

const getProfileInfo = catchAsync(async (req: Request, res: Response) => {
  const result = await UserService.getProfileInfo(
    req.user as UserInfoFromToken
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Profile fetched successfully.',
    data: result,
  });
});

const updateProfile = catchAsync(async (req: Request, res: Response) => {
  const result = await UserService.updateProfile(
    req.user as UserInfoFromToken,
    req.body
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Profile updated Successfully.',
    data: result,
  });
});

export const UserController = {
  getProfileInfo,
  updateProfile,
};

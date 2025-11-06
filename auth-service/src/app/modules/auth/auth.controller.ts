import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { AuthService } from './auth.service';
import { UserInfoFromToken } from '../../../interfaces/common';
import config from '../../../config';

const login = catchAsync(async (req: Request, res: Response) => {
  const result = await AuthService.login(req.body);

  const { refreshToken, ...data } = result;

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    sameSite: 'none',
    secure: true,
    maxAge: config.jwt.refresh_token_expires_in * 1000,
  });

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'User logged in successfully!',
    data: data,
  });
});

const refreshToken = catchAsync(async (req: Request, res: Response) => {
  const { refreshToken } = req.cookies;
  const result = await AuthService.refreshToken(refreshToken);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Access token refreshed successfully!',
    data: result,
  });
});

const changePassword = catchAsync(async (req: Request, res: Response) => {
  await AuthService.changePassword(req.user as UserInfoFromToken, req.body);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Password updated Successfully.',
  });
});

const userRegistration = catchAsync(async (req: Request, res: Response) => {
  await AuthService.userRegistration(req.body);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'Registration successfully completed.',
  });
});

export const AuthController = {
  login,
  userRegistration,
  refreshToken,
  changePassword,
};

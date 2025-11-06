import { User } from '@prisma/client';
import prisma from '../../../shared/prisma';
import httpStatus from 'http-status';
import { ILoginRequest } from './auth.interface';
import {
  hashWithBcrypt,
  isBcryptHashedMatched,
} from '../../../helpers/bcryptHash';
import config from '../../../config';
import ApiError from '../../../errors/ApiError';
import { jwtHelpers } from '../../../helpers/jwtHelpers';
import { Secret } from 'jsonwebtoken';
import { UserInfoFromToken } from '../../../interfaces/common';
import { UserEvents } from '../user/user.events';

const login = async (
  payload: ILoginRequest
): Promise<{
  accessToken: string;
  refreshToken: string;
  role: string;
}> => {
  const isUserExist = await prisma.user.findUnique({
    where: { email: payload.email },
    select: { userId: true, password: true, role: true },
  });

  if (!isUserExist) {
    throw new ApiError(httpStatus.NOT_FOUND, "User doesn't exist.");
  }

  if (!(await isBcryptHashedMatched(payload.password, isUserExist.password))) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Password is incorrect.');
  }

  const accessToken = jwtHelpers.createToken(
    {
      id: isUserExist.userId,
      role: isUserExist.role,
    },
    config.jwt.access_token_secret as Secret,
    config.jwt.access_token_expires_in
  );

  const refreshToken = jwtHelpers.createToken(
    {
      id: isUserExist.userId,
      timestamp: Date.now(),
    },
    config.jwt.refresh_token_secret as Secret,
    config.jwt.refresh_token_expires_in
  );

  return {
    accessToken,
    refreshToken,
    role: isUserExist.role,
  };
};

const refreshToken = async (refreshToken?: string): Promise<string> => {
  if (!refreshToken) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Refresh token is required.');
  }

  const tokenData = jwtHelpers.verifyToken(
    refreshToken,
    config.jwt.refresh_token_secret as Secret
  );

  const isUserExist = await prisma.user.findUnique({
    where: { userId: tokenData.id },
    select: { role: true },
  });

  if (!isUserExist) {
    throw new ApiError(httpStatus.NOT_FOUND, "User doesn't exist.");
  }

  const newAccessToken = jwtHelpers.createToken(
    {
      id: tokenData.id,
      role: isUserExist.role,
    },
    config.jwt.access_token_secret as Secret,
    config.jwt.access_token_expires_in
  );

  return newAccessToken;
};

const changePassword = async (
  userInfo: UserInfoFromToken,
  payload: {
    oldPassword: string;
    newPassword: string;
  }
): Promise<void> => {
  const { oldPassword, newPassword } = payload;

  const isUserExist = await prisma.user.findUnique({
    where: { userId: userInfo.id },
    select: { password: true },
  });

  if (!isUserExist) {
    throw new ApiError(httpStatus.NOT_FOUND, "User doesn't exist.");
  }

  if (!(await isBcryptHashedMatched(oldPassword, isUserExist.password))) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Password is incorrect.');
  }

  const hashedPassword = await hashWithBcrypt(
    newPassword,
    config.jwt.bcrypt_salt_rounds
  );

  await prisma.user.update({
    where: { userId: userInfo.id },
    data: {
      password: hashedPassword,
    },
  });
};

const userRegistration = async (data: Partial<User>) => {
  const checkUser = await prisma.user.findUnique({
    where: { email: data.email },
    select: { password: true },
  });

  if (!data.email || checkUser) {
    throw new ApiError(
      httpStatus.CONFLICT,
      'This email is already registered.'
    );
  }

  const hashedPassword = await hashWithBcrypt(
    '123456',
    config.jwt.bcrypt_salt_rounds
  );

  const createUser = await prisma.user.create({
    data: {
      name: data.name?.trim() || '',
      email: data.email,
      password: hashedPassword,
      contactNumber: data?.contactNumber,
    },
  });

  if (!createUser) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'User create error!');
  }

  await UserEvents.publishUserCreated({
    id: createUser.userId,
    email: createUser.email,
    name: createUser.name?.trim(),
    role: createUser.role,
  });
};

export const AuthService = {
  login,
  userRegistration,
  refreshToken,
  changePassword,
};

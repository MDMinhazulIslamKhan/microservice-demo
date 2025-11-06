import ApiError from '../../../errors/ApiError';
import { User } from '@prisma/client';
import prisma from '../../../shared/prisma';
import httpStatus from 'http-status';
import { UserInfoFromToken } from '../../../interfaces/common';
import { UserEvents } from './user.events';

const getProfileInfo = async (userInfo: UserInfoFromToken) => {
  const checkUser = await prisma.user.findUnique({
    where: { userId: userInfo.id },
    select: {
      email: true,
      name: true,
      role: true,
      contactNumber: true,
      updatedAt: true,
      createdAt: true,
    },
  });

  if (!checkUser) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Account does not exist!');
  }

  return checkUser;
};

const updateProfile = async (
  userInfo: UserInfoFromToken,
  payload: Partial<User>
) => {
  if (payload.email) {
    throw new ApiError(
      httpStatus.UNAVAILABLE_FOR_LEGAL_REASONS,
      'Can not update these information!!!'
    );
  }
  if (!payload || Object.keys(payload).length === 0) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'Please provide updated profile data.'
    );
  }

  const result = await prisma.user.update({
    where: { userId: userInfo.id },
    data: { ...payload },
    select: { userId: true, name: true, email: true, role: true },
  });

  if (payload.name) {
    await UserEvents.publishUserUpdated({
      id: result.userId,
      name: result.name,
    });
  }

  if (!result) {
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      'Something went wrong.'
    );
  }
};

export const UserService = {
  getProfileInfo,
  updateProfile,
};

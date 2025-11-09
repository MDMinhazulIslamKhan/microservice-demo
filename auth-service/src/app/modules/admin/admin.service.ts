import { UserRoles } from '@prisma/client';
import prisma from '../../../shared/prisma';

const allUsers = async () => {
  const result = await prisma.user.findMany({
    orderBy: { name: 'asc' },
    select: {
      email: true,
      name: true,
      role: true,
      userId: true,
      contactNumber: true,
    },
  });

  return result;
};

const userDetails = async (userId: string) => {
  return await prisma.user.findUnique({
    where: { userId: userId },
    select: {
      email: true,
      name: true,
      role: true,
      userId: true,
      contactNumber: true,
    },
  });
};

const createAdmin = async (userId: string) => {
  await prisma.user.update({
    where: { userId: userId },
    data: { role: UserRoles.ADMIN },
  });
};
export const AdminService = {
  allUsers,
  userDetails,
  createAdmin,
};

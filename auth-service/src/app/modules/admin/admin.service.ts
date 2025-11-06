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

export const AdminService = {
  allUsers,
  userDetails,
};

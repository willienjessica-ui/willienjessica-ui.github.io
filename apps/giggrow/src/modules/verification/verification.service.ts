import prisma from '../../db.ts';

export const createVerification = async (userId: string, type: any, metadata: any) => {
  return prisma.verification.create({
    data: {
      userId,
      type,
      metadata: typeof metadata === 'object' ? JSON.stringify(metadata) : metadata,
      status: 'PENDING'
    }
  });
};

export const getUserVerifications = async (userId: string) => {
  return prisma.verification.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' }
  });
};

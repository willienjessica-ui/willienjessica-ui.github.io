import prisma from '../../db.ts';

export const addTimeEntry = async (contractId: string, userId: string, data: any) => {
  const contract = await prisma.contract.findUnique({
    where: { id: contractId },
    include: { provider: true }
  });

  if (!contract || contract.provider.userId !== userId) {
    throw new Error('Unauthorized or Contract not found');
  }

  return prisma.timeEntry.create({
    data: {
      contractId,
      hours: data.hours,
      description: data.description,
      date: new Date(data.date)
    }
  });
};

export const getTimeEntries = async (contractId: string, userId: string, role: string) => {
  const contract = await prisma.contract.findUnique({
    where: { id: contractId },
    include: { client: true, provider: true }
  });

  if (!contract) throw new Error('Contract not found');

  if (role !== 'ADMIN' && contract.client.userId !== userId && contract.provider.userId !== userId) {
    throw new Error('Unauthorized');
  }

  return prisma.timeEntry.findMany({
    where: { contractId },
    orderBy: { date: 'desc' }
  });
};

export const addMaterialLine = async (contractId: string, userId: string, data: any) => {
  const contract = await prisma.contract.findUnique({
    where: { id: contractId },
    include: { provider: true }
  });

  if (!contract || contract.provider.userId !== userId) {
    throw new Error('Unauthorized or Contract not found');
  }

  return prisma.materialLine.create({
    data: {
      contractId,
      item: data.item,
      cost: data.cost
    }
  });
};

export const getMaterialLines = async (contractId: string, userId: string, role: string) => {
  const contract = await prisma.contract.findUnique({
    where: { id: contractId },
    include: { client: true, provider: true }
  });

  if (!contract) throw new Error('Contract not found');

  if (role !== 'ADMIN' && contract.client.userId !== userId && contract.provider.userId !== userId) {
    throw new Error('Unauthorized');
  }

  return prisma.materialLine.findMany({
    where: { contractId },
    orderBy: { createdAt: 'desc' }
  });
};

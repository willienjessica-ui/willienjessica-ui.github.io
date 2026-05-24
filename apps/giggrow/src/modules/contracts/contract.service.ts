import prisma from '../../db.ts';

export const createContract = async (userId: string, jobId: string, providerId: string, termsSnapshot: string) => {
  const client = await prisma.clientProfile.findUnique({ where: { userId } });
  if (!client) throw new Error('Client profile not found');

  const job = await prisma.job.findUnique({ where: { id: jobId } });
  if (!job || job.clientId !== client.id) throw new Error('Unauthorized or Job not found');

  // Update job status to IN_PROGRESS
  await prisma.job.update({
    where: { id: jobId },
    data: { status: 'IN_PROGRESS' }
  });

  return prisma.contract.create({
    data: {
      jobId,
      clientId: client.id,
      providerId,
      termsSnapshot,
      status: 'ACTIVE',
      startDate: new Date()
    }
  });
};

export const getContracts = async (userId: string, role: string) => {
  if (role === 'ADMIN') {
    return prisma.contract.findMany({ include: { client: true, provider: true, job: true } });
  }

  if (role === 'CLIENT') {
    const client = await prisma.clientProfile.findUnique({ where: { userId } });
    if (!client) return [];
    return prisma.contract.findMany({
      where: { clientId: client.id },
      include: { provider: true, job: true }
    });
  }

  const provider = await prisma.providerProfile.findUnique({ where: { userId } });
  if (!provider) return [];
  return prisma.contract.findMany({
    where: { providerId: provider.id },
    include: { client: true, job: true }
  });
};

export const getContractById = async (id: string, userId: string, role: string) => {
  const contract = await prisma.contract.findUnique({
    where: { id },
    include: { client: true, provider: true, job: true, evidenceItems: true }
  });

  if (!contract) throw new Error('Contract not found');

  if (role !== 'ADMIN' && contract.client.userId !== userId && contract.provider.userId !== userId) {
    throw new Error('Unauthorized');
  }

  return contract;
};

export const updateContractStatus = async (id: string, userId: string, status: any, role: string) => {
  const contract = await prisma.contract.findUnique({
    where: { id },
    include: { client: true, provider: true, job: true }
  });

  if (!contract) throw new Error('Contract not found');

  if (role !== 'ADMIN' && contract.client.userId !== userId && contract.provider.userId !== userId) {
    throw new Error('Unauthorized');
  }

  // Update job status if contract is completed
  if (status === 'COMPLETED') {
    await prisma.job.update({
      where: { id: contract.jobId },
      data: { status: 'COMPLETED' }
    });
  }

  return prisma.contract.update({
    where: { id },
    data: { status }
  });
};

export const addEvidence = async (contractId: string, userId: string, data: any) => {
  const contract = await prisma.contract.findUnique({
    where: { id: contractId },
    include: { provider: true }
  });

  if (!contract || contract.provider.userId !== userId) {
    throw new Error('Unauthorized or Contract not found');
  }

  return prisma.evidenceItem.create({
    data: {
      contractId,
      type: data.type,
      url: data.url,
      hash: data.hash,
      description: data.description
    }
  });
};

export const getEvidence = async (contractId: string, userId: string, role: string) => {
  const contract = await prisma.contract.findUnique({
    where: { id: contractId },
    include: { client: true, provider: true }
  });

  if (!contract) throw new Error('Contract not found');

  if (role !== 'ADMIN' && contract.client.userId !== userId && contract.provider.userId !== userId) {
    throw new Error('Unauthorized');
  }

  return prisma.evidenceItem.findMany({
    where: { contractId },
    orderBy: { createdAt: 'desc' }
  });
};

export const addTask = async (contractId: string, userId: string, description: string) => {
  const contract = await prisma.contract.findUnique({
    where: { id: contractId },
    include: { client: true }
  });

  if (!contract || contract.client.userId !== userId) {
    throw new Error('Unauthorized or Contract not found');
  }

  return prisma.task.create({
    data: {
      contractId,
      description
    }
  });
};

export const getTasks = async (contractId: string, userId: string, role: string) => {
  const contract = await prisma.contract.findUnique({
    where: { id: contractId },
    include: { client: true, provider: true }
  });

  if (!contract) throw new Error('Contract not found');

  if (role !== 'ADMIN' && contract.client.userId !== userId && contract.provider.userId !== userId) {
    throw new Error('Unauthorized');
  }

  return prisma.task.findMany({
    where: { contractId },
    orderBy: { createdAt: 'asc' }
  });
};

export const updateTask = async (contractId: string, taskId: string, userId: string, role: string, isCompleted: boolean) => {
  const contract = await prisma.contract.findUnique({
    where: { id: contractId },
    include: { client: true, provider: true }
  });

  if (!contract) throw new Error('Contract not found');

  if (role !== 'ADMIN' && contract.client.userId !== userId && contract.provider.userId !== userId) {
    throw new Error('Unauthorized');
  }

  return prisma.task.update({
    where: { id: taskId, contractId },
    data: { 
      isCompleted,
      completedAt: isCompleted ? new Date() : null
    }
  });
};

export const deleteTask = async (contractId: string, taskId: string, userId: string) => {
  const contract = await prisma.contract.findUnique({
    where: { id: contractId },
    include: { client: true }
  });

  if (!contract || contract.client.userId !== userId) {
    throw new Error('Unauthorized or Contract not found');
  }

  return prisma.task.delete({
    where: { id: taskId, contractId }
  });
};

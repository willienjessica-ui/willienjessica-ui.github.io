import prisma from '../../db.ts';

export const createJob = async (userId: string, data: any) => {
  const client = await prisma.clientProfile.findUnique({ where: { userId } });
  if (!client) throw new Error('Client profile not found');

  return prisma.job.create({
    data: {
      clientId: client.id,
      title: data.title,
      description: data.description,
      category: data.category,
      location: data.location,
      budgetType: data.budgetType,
      budgetMin: data.budgetMin,
      budgetMax: data.budgetMax,
      status: 'OPEN'
    }
  });
};

export const getJobs = async (filters: any) => {
  const { category, status = 'OPEN' } = filters;
  return prisma.job.findMany({
    where: {
      category: category ? String(category) : undefined,
      status: status ? String(status) as any : undefined,
      isPublic: true
    },
    include: { client: { select: { businessName: true } } },
    orderBy: { createdAt: 'desc' }
  });
};

export const getJobById = async (id: string) => {
  const job = await prisma.job.findUnique({
    where: { id },
    include: { client: true }
  });
  if (!job) throw new Error('Job not found');
  return job;
};

export const updateJob = async (id: string, userId: string, data: any) => {
  const job = await prisma.job.findUnique({ where: { id }, include: { client: true } });
  if (!job || job.client.userId !== userId) throw new Error('Unauthorized or Job not found');

  return prisma.job.update({
    where: { id },
    data: {
      title: data.title,
      description: data.description,
      category: data.category,
      location: data.location,
      budgetType: data.budgetType,
      budgetMin: data.budgetMin,
      budgetMax: data.budgetMax
    }
  });
};

export const updateJobStatus = async (id: string, userId: string, status: any, role: string) => {
  const job = await prisma.job.findUnique({ where: { id }, include: { client: true } });
  if (!job) throw new Error('Job not found');
  
  if (role !== 'ADMIN' && job.client.userId !== userId) {
    throw new Error('Unauthorized');
  }

  return prisma.job.update({
    where: { id },
    data: { status }
  });
};

export const applyToJob = async (jobId: string, userId: string, data: any) => {
  const provider = await prisma.providerProfile.findUnique({ where: { userId } });
  if (!provider) throw new Error('Provider profile not found');

  const job = await prisma.job.findUnique({ where: { id: jobId } });
  if (!job || job.status !== 'OPEN') throw new Error('Job not available for applications');

  return prisma.jobApplication.create({
    data: {
      jobId,
      providerId: provider.id,
      proposal: data.proposal,
      bidAmount: data.bidAmount,
      status: 'PENDING'
    }
  });
};

import { ApplicationStatus } from '@prisma/client';

export const updateApplicationStatus = async (applicationId: string, userId: string, status: ApplicationStatus) => {
  const application = await prisma.jobApplication.findUnique({
    where: { id: applicationId },
    include: { job: { include: { client: true } } }
  });

  if (!application) throw new Error('Application not found');
  if (application.job.client.userId !== userId) throw new Error('Unauthorized');

  return prisma.jobApplication.update({
    where: { id: applicationId },
    data: { status }
  });
};

export const getJobApplications = async (jobId: string, userId: string, role: string) => {
  const job = await prisma.job.findUnique({ where: { id: jobId }, include: { client: true } });
  if (!job) throw new Error('Job not found');

  // Only client who posted or Admin can see all applications
  if (role !== 'ADMIN' && job.client.userId !== userId) {
    // If provider, they can only see their own application
    const provider = await prisma.providerProfile.findUnique({ where: { userId } });
    if (!provider) throw new Error('Unauthorized');
    
    return prisma.jobApplication.findMany({
      where: { jobId, providerId: provider.id }
    });
  }

  return prisma.jobApplication.findMany({
    where: { jobId },
    include: { provider: true },
    orderBy: { createdAt: 'desc' }
  });
};

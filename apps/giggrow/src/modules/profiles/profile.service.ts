import prisma from '../../db.ts';
import { MembershipTier, SubscriptionTier } from '@prisma/client';

export const getClientProfile = async (userId: string) => {
  const profile = await prisma.clientProfile.findUnique({
    where: { userId },
    include: { user: { select: { email: true, status: true } } }
  });
  if (!profile) throw new Error('Client profile not found');
  return profile;
};

export const updateClientProfile = async (userId: string, data: any) => {
  const { businessName, contactInfo, accountType } = data;
  return prisma.clientProfile.update({
    where: { userId },
    data: { businessName, contactInfo, accountType }
  });
};

export const upgradeSubscription = async (userId: string, tier: SubscriptionTier) => {
  const expiresAt = new Date();
  expiresAt.setMonth(expiresAt.getMonth() + 1); // 1 month subscription

  return prisma.clientProfile.update({
    where: { userId },
    data: { 
      subscriptionTier: tier,
      subscriptionExpiresAt: expiresAt,
      monthlyUsageCount: 0 // Reset usage on upgrade
    }
  });
};

export const getProviderProfile = async (userId: string) => {
  const profile = await prisma.providerProfile.findUnique({
    where: { userId },
    include: { user: { select: { email: true, status: true } } }
  });
  if (!profile) throw new Error('Provider profile not found');
  return profile;
};

export const updateProviderProfile = async (userId: string, data: any) => {
  const { displayName, trade, serviceArea, experience, isContractorAcknowledged } = data;
  return prisma.providerProfile.update({
    where: { userId },
    data: { displayName, trade, serviceArea, experience, isContractorAcknowledged }
  });
};

export const upgradeMembership = async (userId: string, tier: MembershipTier) => {
  const expiresAt = new Date();
  expiresAt.setMonth(expiresAt.getMonth() + 1); // 1 month membership

  return prisma.providerProfile.update({
    where: { userId },
    data: { 
      membershipTier: tier,
      membershipExpiresAt: expiresAt,
      isPremium: tier === MembershipTier.PREMIUM
    }
  });
};

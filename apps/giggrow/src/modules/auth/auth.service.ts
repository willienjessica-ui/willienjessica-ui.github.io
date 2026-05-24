import bcrypt from 'bcryptjs';
import prisma from '../../db.ts';
import { generateToken } from '../../lib/jwt.ts';

export const registerUser = async (email: string, passwordHash: string, role: any) => {
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    throw new Error('User already exists');
  }

  const hashedPassword = await bcrypt.hash(passwordHash, 10);

  const user = await prisma.user.create({
    data: {
      email,
      passwordHash: hashedPassword,
      role,
      status: 'PENDING_VERIFICATION',
    },
    select: {
      id: true,
      email: true,
      role: true,
      status: true,
      createdAt: true,
    },
  });

  // Create initial profile
  if (role === 'CLIENT') {
    await prisma.clientProfile.create({ data: { userId: user.id } });
  } else if (role === 'PROVIDER') {
    await prisma.providerProfile.create({ data: { userId: user.id } });
  }

  return user;
};

export const loginUser = async (email: string, passwordHash: string) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw new Error('Invalid credentials');
  }

  const isPasswordValid = await bcrypt.compare(passwordHash, user.passwordHash);
  if (!isPasswordValid) {
    throw new Error('Invalid credentials');
  }

  if (user.status === 'SUSPENDED') {
    throw new Error('Account suspended');
  }

  const token = generateToken(user.id, user.role);

  return {
    token,
    user: {
      id: user.id,
      email: user.email,
      role: user.role,
      status: user.status,
    },
  };
};

export const getUserById = async (id: string) => {
  return prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      email: true,
      role: true,
      status: true,
      createdAt: true,
      clientProfile: true,
      providerProfile: true,
    },
  });
};

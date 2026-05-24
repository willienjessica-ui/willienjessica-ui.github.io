import prisma from "../../db";

export class ChatService {
  async getMessages(contractId: string, userId: string) {
    // Verify user is part of the contract
    const contract = await prisma.contract.findUnique({
      where: { id: contractId },
      include: {
        client: true,
        provider: true,
      },
    });

    if (!contract) {
      throw new Error("Contract not found");
    }

    if (contract.client.userId !== userId && contract.provider.userId !== userId) {
      throw new Error("Unauthorized access to chat");
    }

    return prisma.chatMessage.findMany({
      where: { contractId },
      orderBy: { createdAt: "asc" },
      include: {
        sender: {
          select: {
            id: true,
            email: true,
            role: true,
          },
        },
      },
    });
  }

  async sendMessage(contractId: string, senderId: string, content: string) {
    // Verify user is part of the contract
    const contract = await prisma.contract.findUnique({
      where: { id: contractId },
      include: {
        client: true,
        provider: true,
      },
    });

    if (!contract) {
      throw new Error("Contract not found");
    }

    if (contract.client.userId !== senderId && contract.provider.userId !== senderId) {
      throw new Error("Unauthorized to send message");
    }

    return prisma.chatMessage.create({
      data: {
        contractId,
        senderId,
        content,
      },
      include: {
        sender: {
          select: {
            id: true,
            email: true,
            role: true,
          },
        },
      },
    });
  }
}

export const chatService = new ChatService();

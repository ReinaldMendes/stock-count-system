import { prisma } from "../prisma/client";

export class StockCountRepository {
  async findById(id: string) {
    return prisma.stockCount.findUnique({
      where: { id },
      include: {
        employee: true,
        items: {
          include: {
            product: true,
          },
          orderBy: { createdAt: "asc" },
        },
      },
    });
  }

  async updateStatus(id: string, status: string) {
    return prisma.stockCount.update({
      where: { id },
      data: { status },
    });
  }

  async findAll() {
    return prisma.stockCount.findMany({
      include: {
        employee: true,
        _count: { select: { items: true } },
      },
      orderBy: { scheduledAt: "desc" },
    });
  }
}

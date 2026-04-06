import { prisma } from "../prisma/client";

export interface UpdateItemData {
  countedQuantity: number;
  status: string;
  observacao: string | null;
}

export class StockCountItemRepository {
  async findById(id: string) {
    return prisma.stockCountItem.findUnique({
      where: { id },
      include: {
        product: true,
        stockCount: true,
      },
    });
  }

  async update(id: string, data: UpdateItemData) {
    return prisma.stockCountItem.update({
      where: { id },
      data: {
        countedQuantity: data.countedQuantity,
        status: data.status,
        observacao: data.observacao,
      },
      include: {
        product: true,
      },
    });
  }
}

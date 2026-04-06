import { StockCountRepository } from "../repositories/stockCount.repository";
import {
  StockCountItemRepository,
  UpdateItemData,
} from "../repositories/stockCountItem.repository";
import {
  StockCountDTO,
  StockCountItemDTO,
  UpdateItemInput,
} from "../types";

export class StockCountService {
  constructor(
    private stockCountRepo: StockCountRepository,
    private itemRepo: StockCountItemRepository
  ) {}

  // ─── LIST ALL STOCK COUNTS ──────────────────────────────────────────────────

  async getAll() {
    const stockCounts = await this.stockCountRepo.findAll();
    return stockCounts.map((sc) => ({
      id: sc.id,
      code: sc.code,
      scheduledAt: sc.scheduledAt.toISOString(),
      status: sc.status,
      employee: {
        id: sc.employee.id,
        name: sc.employee.name,
      },
      itemCount: sc._count.items,
    }));
  }

  // ─── GET STOCK COUNT ──────────────────────────────────────────────────────────

  async getById(id: string): Promise<StockCountDTO> {
    const stockCount = await this.stockCountRepo.findById(id);

    if (!stockCount) {
      throw new Error("Contagem de estoque não encontrada.");
    }

    const mapItem = (item: typeof stockCount.items[0]): StockCountItemDTO => ({
      id: item.id,
      productId: item.productId,
      productCode: item.product.code,
      productName: item.product.name,
      productUnit: item.product.unit,
      systemQuantity: item.systemQuantity,
      countedQuantity: item.countedQuantity,
      status: item.status,
      observacao: item.observacao,
      updatedAt: item.updatedAt.toISOString(),
    });

    const grouped = {
      A_CONFERIR: stockCount.items
        .filter((i) => i.status === "A_CONFERIR")
        .map(mapItem),
      CONFERIDO: stockCount.items
        .filter((i) => i.status === "CONFERIDO")
        .map(mapItem),
      FALTANTE_EXCEDENTE: stockCount.items
        .filter((i) => i.status === "FALTANTE_EXCEDENTE")
        .map(mapItem),
    };

    return {
      id: stockCount.id,
      code: stockCount.code,
      scheduledAt: stockCount.scheduledAt.toISOString(),
      status: stockCount.status,
      employee: {
        id: stockCount.employee.id,
        name: stockCount.employee.name,
        email: stockCount.employee.email,
      },
      items: grouped,
      summary: {
        total: stockCount.items.length,
        aConferir: grouped.A_CONFERIR.length,
        conferido: grouped.CONFERIDO.length,
        faltanteExcedente: grouped.FALTANTE_EXCEDENTE.length,
      },
    };
  }

  // ─── UPDATE ITEM ──────────────────────────────────────────────────────────────

  async updateItem(
    itemId: string,
    input: UpdateItemInput
  ): Promise<StockCountItemDTO> {
    const { countedQuantity, observacao } = input;

    // 1. Fetch item with stock count
    const item = await this.itemRepo.findById(itemId);
    if (!item) {
      throw new Error("Item não encontrado.");
    }

    // 2. Validate stock count is not finalized
    if (item.stockCount.status === "FINALIZADA") {
      throw new Error(
        "Esta contagem já foi finalizada e não pode ser editada."
      );
    }

    // 3. Calculate status based on quantity comparison
    const quantitiesMatch = countedQuantity === item.systemQuantity;
    const newStatus: string = quantitiesMatch
      ? "CONFERIDO"
      : "FALTANTE_EXCEDENTE";

    // 4. Require observation when there's a discrepancy
    if (newStatus === "FALTANTE_EXCEDENTE") {
      if (!observacao || observacao.trim().length === 0) {
        throw new Error(
          "Observação é obrigatória quando há divergência de quantidade."
        );
      }
    }

    // 5. Persist
    const updateData: UpdateItemData = {
      countedQuantity,
      status: newStatus,
      observacao:
        newStatus === "FALTANTE_EXCEDENTE"
          ? observacao!.trim()
          : null,
    };

    const updated = await this.itemRepo.update(itemId, updateData);

    return {
      id: updated.id,
      productId: updated.productId,
      productCode: updated.product.code,
      productName: updated.product.name,
      productUnit: updated.product.unit,
      systemQuantity: updated.systemQuantity,
      countedQuantity: updated.countedQuantity,
      status: updated.status,
      observacao: updated.observacao,
      updatedAt: updated.updatedAt.toISOString(),
    };
  }

  // ─── UPDATE STOCK COUNT STATUS ────────────────────────────────────────────────

  async updateStatus(
    stockCountId: string,
    action: "SAVE" | "FINALIZE"
  ): Promise<{ id: string; status: string }> {
    const stockCount = await this.stockCountRepo.findById(stockCountId);

    if (!stockCount) {
      throw new Error("Contagem de estoque não encontrada.");
    }

    if (stockCount.status === "FINALIZADA") {
      throw new Error("Esta contagem já foi finalizada.");
    }

    if (action === "FINALIZE") {
      // All FALTANTE_EXCEDENTE items must have an observation
      const incompleteItems = stockCount.items.filter(
        (item) =>
          item.status === "FALTANTE_EXCEDENTE" &&
          (!item.observacao || item.observacao.trim().length === 0)
      );

      if (incompleteItems.length > 0) {
        throw new Error(
          `${incompleteItems.length} item(s) com divergência sem observação. Preencha todas as observações antes de finalizar.`
        );
      }
    }

    const newStatus =
      action === "FINALIZE"
        ? "FINALIZADA"
        : "EM_ANDAMENTO";

    const updated = await this.stockCountRepo.updateStatus(
      stockCountId,
      newStatus
    );

    return { id: updated.id, status: updated.status };
  }
}

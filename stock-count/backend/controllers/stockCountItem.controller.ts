import { Request, Response } from "express";
import { StockCountService } from "../services/stockCount.service";
import { ApiResponse } from "../types";

export class StockCountItemController {
  constructor(private service: StockCountService) {}

  updateItem = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { countedQuantity, observacao } = req.body;

      if (countedQuantity === undefined || countedQuantity === null) {
        const response: ApiResponse<never> = {
          success: false,
          error: "Quantidade contada é obrigatória.",
        };
        return res.status(400).json(response);
      }

      const parsed = Number(countedQuantity);
      if (isNaN(parsed) || parsed < 0) {
        const response: ApiResponse<never> = {
          success: false,
          error: "Quantidade contada deve ser um número não negativo.",
        };
        return res.status(400).json(response);
      }

      const data = await this.service.updateItem(id, {
        countedQuantity: parsed,
        observacao: observacao?.trim() || undefined,
      });

      const response: ApiResponse<typeof data> = { success: true, data };
      res.json(response);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Erro interno do servidor.";
      const status = message.includes("não encontrado")
        ? 404
        : message.includes("finalizada")
        ? 403
        : 400;
      const response: ApiResponse<never> = { success: false, error: message };
      res.status(status).json(response);
    }
  };
}

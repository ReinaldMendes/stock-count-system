import { Request, Response } from "express";
import { StockCountService } from "../services/stockCount.service";
import { ApiResponse } from "../types";

export class StockCountController {
  constructor(private service: StockCountService) {}

  getAll = async (req: Request, res: Response) => {
    try {
      const data = await this.service.getAll();
      const response: ApiResponse<typeof data> = { success: true, data };
      res.json(response);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Erro interno do servidor.";
      const response: ApiResponse<never> = { success: false, error: message };
      res.status(500).json(response);
    }
  };

  getById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const data = await this.service.getById(id);
      const response: ApiResponse<typeof data> = { success: true, data };
      res.json(response);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Erro interno do servidor.";
      const response: ApiResponse<never> = { success: false, error: message };
      res.status(404).json(response);
    }
  };

  updateStatus = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { action } = req.body;

      if (!action || !["SAVE", "FINALIZE"].includes(action)) {
        const response: ApiResponse<never> = {
          success: false,
          error: 'Ação inválida. Use "SAVE" ou "FINALIZE".',
        };
        return res.status(400).json(response);
      }

      const data = await this.service.updateStatus(id, action);
      const response: ApiResponse<typeof data> = { success: true, data };
      res.json(response);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Erro interno do servidor.";
      const status = message.includes("não encontrada") ? 404 : 400;
      const response: ApiResponse<never> = { success: false, error: message };
      res.status(status).json(response);
    }
  };
}

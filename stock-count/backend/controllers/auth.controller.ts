import { Request, Response } from "express";
import { AuthService } from "../services/auth.service";
import { ApiResponse } from "../types";

export class AuthController {
  private authService = new AuthService();

  register = async (req: Request, res: Response) => {
    try {
      const { name, email, password, role } = req.body;

      if (!name || !email || !password) {
        const response: ApiResponse<never> = {
          success: false,
          error: "Nome, e-mail e senha são obrigatórios.",
        };
        return res.status(400).json(response);
      }

      const data = await this.authService.register(
        name,
        email,
        password,
        role || "user"
      );

      const response: ApiResponse<typeof data> = { success: true, data };
      res.status(201).json(response);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Erro interno do servidor.";
      const response: ApiResponse<never> = { success: false, error: message };
      res.status(400).json(response);
    }
  };

  login = async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        const response: ApiResponse<never> = {
          success: false,
          error: "E-mail e senha são obrigatórios.",
        };
        return res.status(400).json(response);
      }

      const data = await this.authService.login(email, password);

      const response: ApiResponse<typeof data> = { success: true, data };
      res.json(response);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Erro interno do servidor.";
      const response: ApiResponse<never> = { success: false, error: message };
      res.status(401).json(response);
    }
  };

  verify = async (req: Request, res: Response) => {
    try {
      // O middleware de auth já extraiu o ID do token
      const employeeId = (req as any).employeeId;

      if (!employeeId) {
        const response: ApiResponse<never> = {
          success: false,
          error: "Token ausente ou inválido.",
        };
        return res.status(401).json(response);
      }

      const response: ApiResponse<{ valid: true }> = {
        success: true,
        data: { valid: true },
      };
      res.json(response);
    } catch (error) {
      const response: ApiResponse<never> = {
        success: false,
        error: "Token inválido.",
      };
      res.status(401).json(response);
    }
  };
}

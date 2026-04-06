import { Request, Response, NextFunction } from "express";
import { AuthService } from "../services/auth.service";

const authService = new AuthService();

export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      error: "Token não fornecido.",
    });
  }

  const token = authHeader.substring(7);
  const decoded = authService.verifyToken(token);

  if (!decoded) {
    return res.status(401).json({
      success: false,
      error: "Token inválido ou expirado.",
    });
  }

  (req as any).employeeId = decoded.id;
  next();
}

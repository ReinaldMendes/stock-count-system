import { Router } from "express";
import { StockCountController } from "../controllers/stockCount.controller";
import { StockCountItemController } from "../controllers/stockCountItem.controller";
import { AuthController } from "../controllers/auth.controller";
import { StockCountService } from "../services/stockCount.service";
import { StockCountRepository } from "../repositories/stockCount.repository";
import { StockCountItemRepository } from "../repositories/stockCountItem.repository";
import { authMiddleware } from "../middleware/auth";

// Dependency injection
const stockCountRepo = new StockCountRepository();
const itemRepo = new StockCountItemRepository();
const service = new StockCountService(stockCountRepo, itemRepo);
const stockCountController = new StockCountController(service);
const itemController = new StockCountItemController(service);
const authController = new AuthController();

const router = Router();

// Auth routes (public)
router.post("/auth/register", authController.register);
router.post("/auth/login", authController.login);
router.get("/auth/verify", authMiddleware, authController.verify);

// Stock Count routes (protected)
router.get("/stock-counts", authMiddleware, stockCountController.getAll);
router.get("/stock-counts/:id", authMiddleware, stockCountController.getById);
router.patch("/stock-counts/:id/status", authMiddleware, stockCountController.updateStatus);

// Stock Count Item routes (protected)
router.patch("/stock-count-items/:id", authMiddleware, itemController.updateItem);

export default router;

import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import routes from "./routes";

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(helmet());
app.use(cors({ origin: process.env.FRONTEND_URL || "http://localhost:3000" }));
app.use(morgan("dev"));
app.use(express.json());

// Health check
app.get("/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// API routes (v1)
app.use("/api/v1", routes);

// 404 handler
app.use((_req, res) => {
  res.status(404).json({ success: false, error: "Rota não encontrada." });
});

// Global error handler
app.use(
  (
    err: Error,
    _req: express.Request,
    res: express.Response,
    _next: express.NextFunction
  ) => {
    console.error("[ERROR]", err);
    res.status(500).json({ success: false, error: "Erro interno do servidor." });
  }
);

app.listen(PORT, () => {
  console.log(`🚀 Backend running on http://localhost:${PORT}`);
  console.log(`📚 API base: http://localhost:${PORT}/api/v1`);
});

export default app;

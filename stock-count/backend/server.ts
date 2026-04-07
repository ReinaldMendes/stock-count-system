import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import routes from "./routes";

const app = express();
const PORT = process.env.PORT || 3001;

const allowedOrigins = [
  process.env.FRONTEND_URL,
  "http://localhost:3000"
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true); // permite Postman / curl

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true
  })
);

app.use(helmet());
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));
app.use(express.json());


app.get("/health", (_req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString()
  });
});


app.use("/api/v1", routes);


app.use((_req, res) => {
  res.status(404).json({
    success: false,
    error: "Rota não encontrada."
  });
});


app.use(
  (
    err: Error,
    _req: express.Request,
    res: express.Response,
    _next: express.NextFunction
  ) => {
    console.error("[ERROR]", err);

    res.status(500).json({
      success: false,
      error:
        process.env.NODE_ENV === "development"
          ? err.message
          : "Erro interno do servidor."
    });
  }
);


app.listen(PORT, () => {
  console.log(`🚀 Backend running on port ${PORT}`);
  console.log(`📚 API base: /api/v1`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV}`);
});

export default app;
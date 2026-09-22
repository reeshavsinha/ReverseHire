import "dotenv/config";
import cors from "cors";
import express from "express";
import mongoose from "mongoose";
import { connectDB, isMongoConnected } from "./config/db.js";
import candidateRoutes from "./routes/candidateRoutes.js";
import companyRoutes from "./routes/companyRoutes.js";
import opportunityRoutes from "./routes/opportunityRoutes.js";
import postRoutes from "./routes/postRoutes.js";
import { errorHandler, notFound } from "./middleware/errorHandler.js";

const app = express();
const port = Number(process.env.PORT) || 5000;

app.use(
  cors({
    origin: process.env.CLIENT_URL?.split(",").map((origin) => origin.trim()) ?? true,
  }),
);
app.use(express.json({ limit: "1mb" }));

app.get("/api/health", (_req, res) => {
  const mongoActive = isMongoConnected();
  res.json({
    success: true,
    data: {
      status: "ok",
      storage: mongoActive ? "mongodb" : "in-memory",
      mongoReadyState: mongoose.connection.readyState,
      fallbackActive: !mongoActive,
      message: mongoActive
        ? "Connected to MongoDB."
        : "Operating in in-memory fallback mode (MongoDB unreachable or unconfigured).",
    },
  });
});

app.use("/api/candidates", candidateRoutes);
app.use("/api/companies", companyRoutes);
app.use("/api/opportunities", opportunityRoutes);
app.use("/api/posts", postRoutes);

app.use(notFound);
app.use(errorHandler);

async function startServer() {
  await connectDB();

  app.listen(port, () => {
    console.log(`ReverseHire API running at http://localhost:${port}`);
    if (isMongoConnected()) {
      console.log("Storage mode: MongoDB (connected)");
    } else {
      console.log("Storage mode: in-memory seeded DataStore (fallback)");
    }
  });
}

startServer();

export default app;

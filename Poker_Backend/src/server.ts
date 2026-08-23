import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import { currentUser, finishGoogleAuth, logout, requireAuth, startGoogleAuth } from "./auth";
import { config } from "./config";
import { prisma } from "./prisma";

const app = express();
app.use(helmet());
app.use(cors({ origin: config.frontendUrl, credentials: true }));
app.use(express.json());
app.use(morgan("dev"));
app.get("/health", (_request, response) => response.json({ status: "ok" }));
app.get("/auth/google", startGoogleAuth);
app.get("/auth/google/callback", finishGoogleAuth);
app.get("/api/auth/me", requireAuth, currentUser);
app.post("/api/auth/logout", logout);

const server = app.listen(config.port, () => console.log(`API listening on ${config.backendUrl}`));
async function shutdown() {
  await prisma.$disconnect();
  server.close(() => process.exit(0));
}
process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

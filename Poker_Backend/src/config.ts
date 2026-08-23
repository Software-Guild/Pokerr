import "dotenv/config";

const required = ["DATABASE_URL", "GOOGLE_CLIENT_ID", "GOOGLE_CLIENT_SECRET", "JWT_SECRET"] as const;
for (const name of required) {
  if (!process.env[name]) throw new Error(`Missing required environment variable: ${name}`);
}

export const config = {
  databaseUrl: process.env.DATABASE_URL as string,
  backendUrl: process.env.BACKEND_URL ?? "http://localhost:5000",
  frontendUrl: process.env.FRONTEND_URL ?? "http://localhost:5173",
  googleClientId: process.env.GOOGLE_CLIENT_ID as string,
  googleClientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
  jwtSecret: process.env.JWT_SECRET as string,
  nodeEnv: process.env.NODE_ENV ?? "development",
  port: Number(process.env.PORT ?? 5000),
} as const;

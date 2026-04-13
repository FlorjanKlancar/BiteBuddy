import { createLogger } from "@bitebuddy/logger";
import { PORTS } from "@bitebuddy/shared";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { auth } from "./auth.js";
import analyzeRoutes from "./routes/analyze.js";
import customFoodsRoutes from "./routes/custom-foods.js";
import foodLogRoutes from "./routes/food-log.js";
import profileRoutes from "./routes/profile.js";
import statsRoutes from "./routes/stats.js";
import weightRoutes from "./routes/weight.js";

const logger = createLogger("api");
const app = new Hono();

// CORS
app.use(
	"*",
	cors({
		origin: process.env.FRONTEND_URL ?? `http://localhost:${PORTS.web}`,
		credentials: true,
	}),
);

// Health check
app.get("/health", (c) => c.json({ status: "ok" }));

// Better Auth handler
app.on(["POST", "GET"], "/api/auth/**", (c) => auth.handler(c.req.raw));

// API routes
app.route("/api/analyze", analyzeRoutes);
app.route("/api/food-log", foodLogRoutes);
app.route("/api/weight", weightRoutes);
app.route("/api/profile", profileRoutes);
app.route("/api/custom-foods", customFoodsRoutes);
app.route("/api/stats", statsRoutes);

const port = PORTS.api;

logger.info(`BiteBuddy API starting on port ${port}`);

export default {
	port,
	fetch: app.fetch,
};

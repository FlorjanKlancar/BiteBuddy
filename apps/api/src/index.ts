import { createLogger } from "@bitebuddy/logger";
import { PORTS } from "@bitebuddy/shared";
import { Hono } from "hono";
import { bodyLimit } from "hono/body-limit";
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
if (!process.env.FRONTEND_URL) {
	logger.warn("FRONTEND_URL is not set — CORS will allow localhost only. Set it in production.");
}
const allowedOrigins = process.env.FRONTEND_URL
	? process.env.FRONTEND_URL.split(",").map((u) => u.trim())
	: [`http://localhost:${PORTS.web}`];

app.use(
	"*",
	cors({
		origin: allowedOrigins,
		credentials: true,
	}),
);

// Default body size limit (1MB)
app.use("/api/*", bodyLimit({ maxSize: 1024 * 1024 }));
// Larger limit for image analysis (6MB)
app.use("/api/analyze", bodyLimit({ maxSize: 6 * 1024 * 1024 }));

// Health check
app.get("/health", (c) => c.json({ status: "ok" }));

// Better Auth handler
app.on(["POST", "GET"], "/api/auth/**", (c) => auth.handler(c.req.raw));

// API routes (analyze must be before the default body limit takes effect)
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

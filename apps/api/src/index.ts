import { createLogger } from "@bitebuddy/logger";
import { PORTS } from "@bitebuddy/shared";
import { Hono } from "hono";
import { bodyLimit } from "hono/body-limit";
import { cors } from "hono/cors";
import { auth } from "./auth.js";
import { runMigrations } from "./db/migrate.js";
import analyzeRoutes from "./routes/analyze.js";
import customFoodsRoutes from "./routes/custom-foods.js";
import foodLogRoutes from "./routes/food-log.js";
import profileRoutes from "./routes/profile.js";
import statsRoutes from "./routes/stats.js";
import weightRoutes from "./routes/weight.js";

const logger = createLogger("api");

// Run database migrations before starting the server
await runMigrations();

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

// Better Auth handler — rewrite request URL so Better Auth sees the real
// public origin instead of the internal http://localhost behind the proxy.
app.on(["POST", "GET"], "/api/auth/**", async (c) => {
	const baseURL = process.env.BETTER_AUTH_URL;
	const reqUrl = c.req.url;
	const cookies = c.req.header("cookie") ?? "(none)";
	const isCallback = reqUrl.includes("/callback/");

	if (isCallback) {
		logger.info(`[AUTH CALLBACK] URL: ${reqUrl}`);
		logger.info(`[AUTH CALLBACK] Cookies present: ${cookies}`);
		logger.info(`[AUTH CALLBACK] BETTER_AUTH_URL: ${baseURL}`);
		logger.info(`[AUTH CALLBACK] NODE_ENV: ${process.env.NODE_ENV}`);
	}

	let request = c.req.raw;
	if (baseURL) {
		const url = new URL(reqUrl);
		const publicUrl = new URL(baseURL);
		url.protocol = publicUrl.protocol;
		url.host = publicUrl.host;
		const rewrittenUrl = url.toString();
		if (isCallback) {
			logger.info(`[AUTH CALLBACK] Rewritten URL: ${rewrittenUrl}`);
		}
		request = new Request(rewrittenUrl, c.req.raw);
	}

	const response = await auth.handler(request);

	if (!isCallback) {
		// Log Set-Cookie headers on the initial sign-in (before redirect to Google)
		const setCookies = response.headers.getSetCookie?.() ?? [];
		if (setCookies.length > 0) {
			logger.info(`[AUTH SIGNIN] Set-Cookie headers: ${JSON.stringify(setCookies)}`);
		}
	}

	return response;
});

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

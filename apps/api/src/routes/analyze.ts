import { Hono } from "hono";
import { authMiddleware } from "../middleware/auth.js";
import { analyzeFood } from "../services/ai.js";

const MAX_BASE64_SIZE = 5 * 1024 * 1024; // 5MB base64 (~3.75MB image)
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 10;

const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(userId: string): boolean {
	const now = Date.now();
	const entry = rateLimitMap.get(userId);

	// Evict expired entries to prevent memory leak
	for (const [key, val] of rateLimitMap) {
		if (now > val.resetAt) rateLimitMap.delete(key);
	}

	if (!entry || now > entry.resetAt) {
		rateLimitMap.set(userId, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
		return true;
	}

	if (entry.count >= RATE_LIMIT_MAX) return false;
	entry.count++;
	return true;
}

const app = new Hono();

app.post("/", authMiddleware, async (c) => {
	const user = c.get("user") as { id: string } | undefined;
	if (user && !checkRateLimit(user.id)) {
		return c.json({ error: "Too many requests. Please wait a moment." }, 429);
	}

	const body = await c.req.json();
	const { image } = body as { image: string };

	if (!image || typeof image !== "string") {
		return c.json({ error: "Image is required" }, 400);
	}

	if (image.length > MAX_BASE64_SIZE) {
		return c.json({ error: "Image is too large. Please use a smaller image." }, 413);
	}

	if (!/^[A-Za-z0-9+/=]+$/.test(image)) {
		return c.json({ error: "Invalid image data" }, 400);
	}

	if (
		!process.env.OPENAI_API_KEY ||
		process.env.OPENAI_API_KEY === "sk-your-openai-api-key"
	) {
		return c.json({ error: "OpenAI API key is not configured. Set OPENAI_API_KEY in .env" }, 503);
	}

	try {
		const result = await analyzeFood(image);
		return c.json(result);
	} catch (err) {
		console.error("AI analysis failed:", err);
		return c.json({ error: "Analysis failed. Please try again." }, 500);
	}
});

export default app;

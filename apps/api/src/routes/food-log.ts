import { CreateFoodLogInput } from "@bitebuddy/shared";
import { and, desc, eq } from "drizzle-orm";
import { Hono } from "hono";
import { db } from "../db/index.js";
import { foodLogEntries } from "../db/schema.js";
import { authMiddleware } from "../middleware/auth.js";

const app = new Hono();

// Get entries for a specific date
app.get("/", authMiddleware, async (c) => {
	const user = c.get("user");
	const date = c.req.query("date");

	if (!date) {
		return c.json({ error: "date query parameter is required" }, 400);
	}

	const entries = await db
		.select()
		.from(foodLogEntries)
		.where(and(eq(foodLogEntries.userId, user.id), eq(foodLogEntries.date, date)))
		.orderBy(foodLogEntries.createdAt);

	return c.json(entries);
});

// Create a new food log entry
app.post("/", authMiddleware, async (c) => {
	const user = c.get("user");
	const body = await c.req.json();
	const parsed = CreateFoodLogInput.parse(body);

	const [entry] = await db
		.insert(foodLogEntries)
		.values({
			userId: user.id,
			...parsed,
		})
		.returning();

	return c.json(entry, 201);
});

// Delete a food log entry
app.delete("/:id", authMiddleware, async (c) => {
	const user = c.get("user");
	const id = c.req.param("id");

	const [deleted] = await db
		.delete(foodLogEntries)
		.where(and(eq(foodLogEntries.id, id), eq(foodLogEntries.userId, user.id)))
		.returning();

	if (!deleted) {
		return c.json({ error: "Entry not found" }, 404);
	}

	return c.json({ success: true });
});

// Get recent foods for quick re-logging
app.get("/recent", authMiddleware, async (c) => {
	const user = c.get("user");

	const recent = await db
		.select()
		.from(foodLogEntries)
		.where(eq(foodLogEntries.userId, user.id))
		.orderBy(desc(foodLogEntries.createdAt))
		.limit(20);

	return c.json(recent);
});

export default app;

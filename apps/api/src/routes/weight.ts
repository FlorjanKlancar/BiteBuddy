import { CreateWeightEntryInput } from "@bitebuddy/shared";
import { and, desc, eq } from "drizzle-orm";
import { Hono } from "hono";
import { db } from "../db/index.js";
import { weightEntries } from "../db/schema.js";
import { authMiddleware } from "../middleware/auth.js";

const app = new Hono();

// Get weight entries
app.get("/", authMiddleware, async (c) => {
	const user = c.get("user");
	const raw = Number(c.req.query("limit") ?? 90);
	const limit = Math.min(Math.max(1, Number.isNaN(raw) ? 90 : raw), 365);

	const entries = await db
		.select()
		.from(weightEntries)
		.where(eq(weightEntries.userId, user.id))
		.orderBy(desc(weightEntries.date))
		.limit(limit);

	return c.json(entries);
});

// Create a weight entry
app.post("/", authMiddleware, async (c) => {
	const user = c.get("user");
	const body = await c.req.json();
	const parsed = CreateWeightEntryInput.parse(body);

	const [entry] = await db
		.insert(weightEntries)
		.values({
			userId: user.id,
			...parsed,
		})
		.returning();

	return c.json(entry, 201);
});

// Delete a weight entry
app.delete("/:id", authMiddleware, async (c) => {
	const user = c.get("user");
	const id = c.req.param("id");

	const [deleted] = await db
		.delete(weightEntries)
		.where(and(eq(weightEntries.id, id), eq(weightEntries.userId, user.id)))
		.returning();

	if (!deleted) {
		return c.json({ error: "Entry not found" }, 404);
	}

	return c.json({ success: true });
});

export default app;

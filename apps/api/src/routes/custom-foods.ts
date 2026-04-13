import { CreateCustomFoodInput } from "@bitebuddy/shared";
import { and, eq } from "drizzle-orm";
import { Hono } from "hono";
import { db } from "../db/index.js";
import { customFoods } from "../db/schema.js";
import { authMiddleware } from "../middleware/auth.js";

const app = new Hono();

// List custom foods
app.get("/", authMiddleware, async (c) => {
	const user = c.get("user");

	const foods = await db
		.select()
		.from(customFoods)
		.where(eq(customFoods.userId, user.id))
		.orderBy(customFoods.name);

	return c.json(foods);
});

// Create custom food
app.post("/", authMiddleware, async (c) => {
	const user = c.get("user");
	const body = await c.req.json();
	const parsed = CreateCustomFoodInput.parse(body);

	const [food] = await db
		.insert(customFoods)
		.values({ userId: user.id, ...parsed })
		.returning();

	return c.json(food, 201);
});

// Delete custom food
app.delete("/:id", authMiddleware, async (c) => {
	const user = c.get("user");
	const id = c.req.param("id");

	const [deleted] = await db
		.delete(customFoods)
		.where(and(eq(customFoods.id, id), eq(customFoods.userId, user.id)))
		.returning();

	if (!deleted) {
		return c.json({ error: "Food not found" }, 404);
	}

	return c.json({ success: true });
});

export default app;

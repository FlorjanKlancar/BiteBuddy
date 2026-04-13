import { UserProfile } from "@bitebuddy/shared";
import { eq } from "drizzle-orm";
import { Hono } from "hono";
import { db } from "../db/index.js";
import { userProfiles } from "../db/schema.js";
import { authMiddleware } from "../middleware/auth.js";

const app = new Hono();

// Get user profile
app.get("/", authMiddleware, async (c) => {
	const user = c.get("user");

	const [profile] = await db.select().from(userProfiles).where(eq(userProfiles.userId, user.id));

	if (!profile) {
		return c.json(null);
	}

	return c.json(profile);
});

// Create or update profile
app.put("/", authMiddleware, async (c) => {
	const user = c.get("user");
	const body = await c.req.json();

	const [existing] = await db.select().from(userProfiles).where(eq(userProfiles.userId, user.id));

	if (existing) {
		const parsed = UserProfile.partial().parse(body);
		const [updated] = await db
			.update(userProfiles)
			.set({ ...parsed, updatedAt: new Date() })
			.where(eq(userProfiles.userId, user.id))
			.returning();
		return c.json(updated);
	}

	const parsed = UserProfile.parse(body);
	const [created] = await db
		.insert(userProfiles)
		.values({ userId: user.id, ...parsed })
		.returning();

	return c.json(created, 201);
});

export default app;

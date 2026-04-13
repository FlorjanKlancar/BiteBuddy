import { and, eq, gte, lte, sql } from "drizzle-orm";
import { Hono } from "hono";
import { db } from "../db/index.js";
import { foodLogEntries } from "../db/schema.js";
import { authMiddleware } from "../middleware/auth.js";

const app = new Hono();

// Get daily summary for a date
app.get("/daily", authMiddleware, async (c) => {
	const user = c.get("user");
	const date = c.req.query("date");

	if (!date) {
		return c.json({ error: "date query parameter is required" }, 400);
	}

	const [summary] = await db
		.select({
			totalCalories: sql<number>`COALESCE(SUM(${foodLogEntries.calories}), 0)`,
			totalProteinG: sql<number>`COALESCE(SUM(${foodLogEntries.proteinG}), 0)`,
			totalCarbsG: sql<number>`COALESCE(SUM(${foodLogEntries.carbsG}), 0)`,
			totalFatG: sql<number>`COALESCE(SUM(${foodLogEntries.fatG}), 0)`,
			entryCount: sql<number>`COUNT(*)`,
		})
		.from(foodLogEntries)
		.where(and(eq(foodLogEntries.userId, user.id), eq(foodLogEntries.date, date)));

	return c.json(summary);
});

// Get weekly summary (last 7 days)
app.get("/weekly", authMiddleware, async (c) => {
	const user = c.get("user");

	const today = new Date();
	const sevenDaysAgo = new Date(today);
	sevenDaysAgo.setDate(today.getDate() - 6);

	const startDate = sevenDaysAgo.toISOString().split("T")[0];
	const endDate = today.toISOString().split("T")[0];

	const dailyTotals = await db
		.select({
			date: foodLogEntries.date,
			totalCalories: sql<number>`COALESCE(SUM(${foodLogEntries.calories}), 0)`,
			totalProteinG: sql<number>`COALESCE(SUM(${foodLogEntries.proteinG}), 0)`,
			totalCarbsG: sql<number>`COALESCE(SUM(${foodLogEntries.carbsG}), 0)`,
			totalFatG: sql<number>`COALESCE(SUM(${foodLogEntries.fatG}), 0)`,
		})
		.from(foodLogEntries)
		.where(
			and(
				eq(foodLogEntries.userId, user.id),
				gte(foodLogEntries.date, startDate),
				lte(foodLogEntries.date, endDate),
			),
		)
		.groupBy(foodLogEntries.date)
		.orderBy(foodLogEntries.date);

	return c.json(dailyTotals);
});

// Get streak (consecutive days logged)
app.get("/streak", authMiddleware, async (c) => {
	const user = c.get("user");

	const dates = await db
		.selectDistinct({ date: foodLogEntries.date })
		.from(foodLogEntries)
		.where(eq(foodLogEntries.userId, user.id))
		.orderBy(sql`${foodLogEntries.date} DESC`);

	let streak = 0;
	const today = new Date();

	for (let i = 0; i < dates.length; i++) {
		const expected = new Date(today);
		expected.setDate(today.getDate() - i);
		const expectedDate = expected.toISOString().split("T")[0];

		if (dates[i].date === expectedDate) {
			streak++;
		} else {
			break;
		}
	}

	return c.json({ streak });
});

export default app;

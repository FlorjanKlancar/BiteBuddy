import {
	boolean,
	integer,
	jsonb,
	pgEnum,
	pgTable,
	real,
	text,
	timestamp,
	varchar,
} from "drizzle-orm/pg-core";

// ── Better Auth core tables ──

export const user = pgTable("user", {
	id: text("id").primaryKey(),
	email: text("email").unique().notNull(),
	emailVerified: boolean("email_verified").notNull().default(false),
	name: text("name").notNull(),
	image: text("image"),
	createdAt: timestamp("created_at").defaultNow().notNull(),
	updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const session = pgTable("session", {
	id: text("id").primaryKey(),
	userId: text("user_id")
		.notNull()
		.references(() => user.id, { onDelete: "cascade" }),
	expiresAt: timestamp("expires_at").notNull(),
	token: text("token").unique().notNull(),
	ipAddress: text("ip_address"),
	userAgent: text("user_agent"),
	createdAt: timestamp("created_at").defaultNow().notNull(),
	updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const account = pgTable("account", {
	id: text("id").primaryKey(),
	userId: text("user_id")
		.notNull()
		.references(() => user.id, { onDelete: "cascade" }),
	providerId: text("provider_id").notNull(),
	accountId: text("account_id").notNull(),
	accessToken: text("access_token"),
	refreshToken: text("refresh_token"),
	idToken: text("id_token"),
	accessTokenExpiresAt: timestamp("access_token_expires_at"),
	refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
	scope: text("scope"),
	password: text("password"),
	createdAt: timestamp("created_at").defaultNow().notNull(),
	updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const verification = pgTable("verification", {
	id: text("id").primaryKey(),
	identifier: text("identifier").notNull(),
	value: text("value").notNull(),
	expiresAt: timestamp("expires_at").notNull(),
	createdAt: timestamp("created_at").defaultNow().notNull(),
	updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// ── App tables ──

export const mealTypeEnum = pgEnum("meal_type", ["breakfast", "lunch", "dinner", "snack"]);
export const foodSourceEnum = pgEnum("food_source", ["ai_photo", "manual", "custom_food"]);
export const genderEnum = pgEnum("gender", ["male", "female"]);
export const activityLevelEnum = pgEnum("activity_level", [
	"sedentary",
	"lightly_active",
	"moderately_active",
	"very_active",
	"extra_active",
]);

export const userProfiles = pgTable("user_profiles", {
	userId: text("user_id")
		.primaryKey()
		.references(() => user.id, { onDelete: "cascade" }),
	age: integer("age"),
	heightCm: real("height_cm"),
	weightKg: real("weight_kg"),
	gender: genderEnum("gender"),
	activityLevel: activityLevelEnum("activity_level"),
	calorieTarget: integer("calorie_target").default(2000),
	proteinTargetG: integer("protein_target_g").default(150),
	carbsTargetG: integer("carbs_target_g").default(200),
	fatTargetG: integer("fat_target_g").default(67),
	weightGoalKg: real("weight_goal_kg"),
	createdAt: timestamp("created_at").defaultNow().notNull(),
	updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const foodLogEntries = pgTable("food_log_entries", {
	id: text("id")
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	userId: text("user_id")
		.notNull()
		.references(() => user.id, { onDelete: "cascade" }),
	date: varchar("date", { length: 10 }).notNull(), // YYYY-MM-DD
	mealType: mealTypeEnum("meal_type").notNull(),
	name: text("name").notNull(),
	calories: real("calories").notNull(),
	proteinG: real("protein_g").notNull().default(0),
	carbsG: real("carbs_g").notNull().default(0),
	fatG: real("fat_g").notNull().default(0),
	servingSize: text("serving_size"),
	servingUnit: text("serving_unit"),
	photoUrl: text("photo_url"),
	source: foodSourceEnum("source").notNull(),
	aiRawResponse: jsonb("ai_raw_response"),
	createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const customFoods = pgTable("custom_foods", {
	id: text("id")
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	userId: text("user_id")
		.notNull()
		.references(() => user.id, { onDelete: "cascade" }),
	name: text("name").notNull(),
	calories: real("calories").notNull(),
	proteinG: real("protein_g").notNull().default(0),
	carbsG: real("carbs_g").notNull().default(0),
	fatG: real("fat_g").notNull().default(0),
	servingSize: text("serving_size"),
	servingUnit: text("serving_unit"),
	createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const weightEntries = pgTable("weight_entries", {
	id: text("id")
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	userId: text("user_id")
		.notNull()
		.references(() => user.id, { onDelete: "cascade" }),
	date: varchar("date", { length: 10 }).notNull(), // YYYY-MM-DD
	weightKg: real("weight_kg").notNull(),
	createdAt: timestamp("created_at").defaultNow().notNull(),
});

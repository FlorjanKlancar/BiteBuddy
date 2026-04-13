DO $$ BEGIN
  CREATE TYPE "public"."activity_level" AS ENUM('sedentary', 'lightly_active', 'moderately_active', 'very_active', 'extra_active');
EXCEPTION WHEN duplicate_object THEN null;
END $$;--> statement-breakpoint
DO $$ BEGIN
  CREATE TYPE "public"."food_source" AS ENUM('ai_photo', 'manual', 'custom_food');
EXCEPTION WHEN duplicate_object THEN null;
END $$;--> statement-breakpoint
DO $$ BEGIN
  CREATE TYPE "public"."gender" AS ENUM('male', 'female');
EXCEPTION WHEN duplicate_object THEN null;
END $$;--> statement-breakpoint
DO $$ BEGIN
  CREATE TYPE "public"."meal_type" AS ENUM('breakfast', 'lunch', 'dinner', 'snack');
EXCEPTION WHEN duplicate_object THEN null;
END $$;--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "account" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"provider_id" text NOT NULL,
	"account_id" text NOT NULL,
	"access_token" text,
	"refresh_token" text,
	"id_token" text,
	"access_token_expires_at" timestamp,
	"refresh_token_expires_at" timestamp,
	"scope" text,
	"password" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "custom_foods" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"name" text NOT NULL,
	"calories" real NOT NULL,
	"protein_g" real DEFAULT 0 NOT NULL,
	"carbs_g" real DEFAULT 0 NOT NULL,
	"fat_g" real DEFAULT 0 NOT NULL,
	"serving_size" text,
	"serving_unit" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "food_log_entries" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"date" varchar(10) NOT NULL,
	"meal_type" "meal_type" NOT NULL,
	"name" text NOT NULL,
	"calories" real NOT NULL,
	"protein_g" real DEFAULT 0 NOT NULL,
	"carbs_g" real DEFAULT 0 NOT NULL,
	"fat_g" real DEFAULT 0 NOT NULL,
	"serving_size" text,
	"serving_unit" text,
	"photo_url" text,
	"source" "food_source" NOT NULL,
	"ai_raw_response" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "session" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"token" text NOT NULL,
	"ip_address" text,
	"user_agent" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "session_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user" (
	"id" text PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"email_verified" boolean DEFAULT false NOT NULL,
	"name" text NOT NULL,
	"image" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user_profiles" (
	"user_id" text PRIMARY KEY NOT NULL,
	"age" integer,
	"height_cm" real,
	"weight_kg" real,
	"gender" "gender",
	"activity_level" "activity_level",
	"calorie_target" integer DEFAULT 2000,
	"protein_target_g" integer DEFAULT 150,
	"carbs_target_g" integer DEFAULT 200,
	"fat_target_g" integer DEFAULT 67,
	"weight_goal_kg" real,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "verification" (
	"id" text PRIMARY KEY NOT NULL,
	"identifier" text NOT NULL,
	"value" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "weight_entries" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"date" varchar(10) NOT NULL,
	"weight_kg" real NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
  ALTER TABLE "account" ADD CONSTRAINT "account_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;--> statement-breakpoint
DO $$ BEGIN
  ALTER TABLE "custom_foods" ADD CONSTRAINT "custom_foods_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;--> statement-breakpoint
DO $$ BEGIN
  ALTER TABLE "food_log_entries" ADD CONSTRAINT "food_log_entries_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;--> statement-breakpoint
DO $$ BEGIN
  ALTER TABLE "session" ADD CONSTRAINT "session_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;--> statement-breakpoint
DO $$ BEGIN
  ALTER TABLE "user_profiles" ADD CONSTRAINT "user_profiles_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;--> statement-breakpoint
DO $$ BEGIN
  ALTER TABLE "weight_entries" ADD CONSTRAINT "weight_entries_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;
import { z } from "zod";

export const Gender = z.enum(["male", "female"]);
export type Gender = z.infer<typeof Gender>;

export const ActivityLevel = z.enum([
	"sedentary",
	"lightly_active",
	"moderately_active",
	"very_active",
	"extra_active",
]);
export type ActivityLevel = z.infer<typeof ActivityLevel>;

export const UserProfile = z.object({
	age: z.number().min(1).max(150),
	heightCm: z.number().min(50).max(300),
	weightKg: z.number().min(20).max(500),
	gender: Gender,
	activityLevel: ActivityLevel,
	calorieTarget: z.number().min(0),
	proteinTargetG: z.number().min(0),
	carbsTargetG: z.number().min(0),
	fatTargetG: z.number().min(0),
	weightGoalKg: z.number().min(20).max(500).nullable(),
});
export type UserProfile = z.infer<typeof UserProfile>;

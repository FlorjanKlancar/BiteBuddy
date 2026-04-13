import type { ActivityLevel, Gender } from "../types/user";

const ACTIVITY_MULTIPLIERS: Record<ActivityLevel, number> = {
	sedentary: 1.2,
	lightly_active: 1.375,
	moderately_active: 1.55,
	very_active: 1.725,
	extra_active: 1.9,
};

/**
 * Calculate Basal Metabolic Rate using Mifflin-St Jeor equation.
 */
export function calculateBMR(
	weightKg: number,
	heightCm: number,
	age: number,
	gender: Gender,
): number {
	const base = 10 * weightKg + 6.25 * heightCm - 5 * age;
	return gender === "male" ? base + 5 : base - 161;
}

/**
 * Calculate Total Daily Energy Expenditure.
 */
export function calculateTDEE(
	weightKg: number,
	heightCm: number,
	age: number,
	gender: Gender,
	activityLevel: ActivityLevel,
): number {
	const bmr = calculateBMR(weightKg, heightCm, age, gender);
	return Math.round(bmr * ACTIVITY_MULTIPLIERS[activityLevel]);
}

/**
 * Calculate default macro targets from calorie target.
 * Default split: 30% protein, 40% carbs, 30% fat.
 */
export function calculateDefaultMacros(calorieTarget: number) {
	return {
		proteinG: Math.round((calorieTarget * 0.3) / 4),
		carbsG: Math.round((calorieTarget * 0.4) / 4),
		fatG: Math.round((calorieTarget * 0.3) / 9),
	};
}

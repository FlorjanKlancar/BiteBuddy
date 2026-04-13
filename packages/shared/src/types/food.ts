import { z } from "zod";

export const MealType = z.enum(["breakfast", "lunch", "dinner", "snack"]);
export type MealType = z.infer<typeof MealType>;

export const FoodSource = z.enum(["ai_photo", "manual", "custom_food"]);
export type FoodSource = z.infer<typeof FoodSource>;

export const NutritionInfo = z.object({
	calories: z.number().min(0),
	proteinG: z.number().min(0),
	carbsG: z.number().min(0),
	fatG: z.number().min(0),
});
export type NutritionInfo = z.infer<typeof NutritionInfo>;

export const AnalyzedFoodItem = z.object({
	name: z.string(),
	estimatedPortion: z.string(),
	calories: z.number(),
	proteinG: z.number(),
	carbsG: z.number(),
	fatG: z.number(),
});
export type AnalyzedFoodItem = z.infer<typeof AnalyzedFoodItem>;

export const FoodAnalysisResult = z.object({
	items: z.array(AnalyzedFoodItem),
	totalCalories: z.number(),
	totalProteinG: z.number(),
	totalCarbsG: z.number(),
	totalFatG: z.number(),
	confidence: z.enum(["low", "medium", "high"]),
});
export type FoodAnalysisResult = z.infer<typeof FoodAnalysisResult>;

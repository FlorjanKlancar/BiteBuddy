import { z } from "zod";
import { MealType } from "./food";

export const CreateFoodLogInput = z.object({
	date: z.string(),
	mealType: MealType,
	name: z.string().min(1),
	calories: z.number().min(0),
	proteinG: z.number().min(0),
	carbsG: z.number().min(0),
	fatG: z.number().min(0),
	servingSize: z.string().optional(),
	servingUnit: z.string().optional(),
	photoUrl: z.string().url().nullable().optional(),
	source: z.enum(["ai_photo", "manual", "custom_food"]),
	aiRawResponse: z.any().nullable().optional(),
});
export type CreateFoodLogInput = z.infer<typeof CreateFoodLogInput>;

export const CreateWeightEntryInput = z.object({
	date: z.string(),
	weightKg: z.number().min(20).max(500),
});
export type CreateWeightEntryInput = z.infer<typeof CreateWeightEntryInput>;

export const CreateCustomFoodInput = z.object({
	name: z.string().min(1),
	calories: z.number().min(0),
	proteinG: z.number().min(0),
	carbsG: z.number().min(0),
	fatG: z.number().min(0),
	servingSize: z.string().optional(),
	servingUnit: z.string().optional(),
});
export type CreateCustomFoodInput = z.infer<typeof CreateCustomFoodInput>;

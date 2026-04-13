"use client";

import { FadeIn, SlideIn } from "@/components/motion";
import {
	OnboardingActivityIllustration,
	OnboardingBodyIllustration,
	OnboardingTargetIllustration,
} from "@/components/illustrations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/api";
import { calculateDefaultMacros, calculateTDEE } from "@bitebuddy/shared";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { AnimatePresence, motion } from "framer-motion";
import {
	Armchair,
	ArrowLeft,
	ArrowRight,
	Check,
	Dumbbell,
	Footprints,
	Loader2,
	Trophy,
	Zap,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

type ActivityLevelValue =
	| "sedentary"
	| "lightly_active"
	| "moderately_active"
	| "very_active"
	| "extra_active";

const ACTIVITY_OPTIONS: {
	value: ActivityLevelValue;
	label: string;
	desc: string;
	icon: typeof Armchair;
}[] = [
	{
		value: "sedentary",
		label: "Sedentary",
		desc: "Little to no exercise",
		icon: Armchair,
	},
	{
		value: "lightly_active",
		label: "Lightly Active",
		desc: "Exercise 1-3 days/week",
		icon: Footprints,
	},
	{
		value: "moderately_active",
		label: "Moderately Active",
		desc: "Exercise 3-5 days/week",
		icon: Dumbbell,
	},
	{
		value: "very_active",
		label: "Very Active",
		desc: "Hard exercise 6-7 days/week",
		icon: Zap,
	},
	{
		value: "extra_active",
		label: "Athlete",
		desc: "Professional / twice per day",
		icon: Trophy,
	},
];

const STEP_META = [
	{ num: 1, label: "About You" },
	{ num: 2, label: "Activity" },
	{ num: 3, label: "Goals" },
];

// --- Zod schemas ---
const step1Schema = z.object({
	gender: z.enum(["male", "female"]),
	age: z.number().min(1, "Enter a valid age").max(150, "Enter a valid age"),
	heightCm: z.number().min(50, "Min 50 cm").max(300, "Max 300 cm"),
	weightKg: z.number().min(20, "Min 20 kg").max(500, "Max 500 kg"),
});
type Step1Data = z.infer<typeof step1Schema>;

const step2Schema = z.object({
	activityLevel: z.enum([
		"sedentary",
		"lightly_active",
		"moderately_active",
		"very_active",
		"extra_active",
	]),
});
type Step2Data = z.infer<typeof step2Schema>;

const step3Schema = z.object({
	calorieTarget: z.number().min(0, "Must be positive"),
	proteinG: z.number().min(0, "Must be positive"),
	carbsG: z.number().min(0, "Must be positive"),
	fatG: z.number().min(0, "Must be positive"),
});
type Step3Data = z.infer<typeof step3Schema>;

function FieldError({ message }: { message?: string }) {
	if (!message) return null;
	return (
		<motion.p
			initial={{ opacity: 0, y: -4 }}
			animate={{ opacity: 1, y: 0 }}
			className="text-xs text-red-500 mt-1.5 pl-1"
		>
			{message}
		</motion.p>
	);
}

export default function OnboardingPage() {
	const router = useRouter();
	const [step, setStep] = useState(1);
	const [saving, setSaving] = useState(false);

	const form1 = useForm<Step1Data>({
		resolver: standardSchemaResolver(step1Schema),
		defaultValues: { gender: "male", age: 25, heightCm: 175, weightKg: 75 },
	});

	const form2 = useForm<Step2Data>({
		resolver: standardSchemaResolver(step2Schema),
		defaultValues: { activityLevel: "moderately_active" },
	});

	const form3 = useForm<Step3Data>({
		resolver: standardSchemaResolver(step3Schema),
		defaultValues: { calorieTarget: 0, proteinG: 0, carbsG: 0, fatG: 0 },
	});

	function handleStep1Continue() {
		form1.handleSubmit(() => setStep(2))();
	}

	function handleStep2Continue() {
		form2.handleSubmit((data) => {
			const s1 = form1.getValues();
			const tdee = calculateTDEE(
				s1.weightKg,
				s1.heightCm,
				s1.age,
				s1.gender as "male" | "female",
				data.activityLevel as ActivityLevelValue,
			);
			const macros = calculateDefaultMacros(tdee);
			form3.reset({
				calorieTarget: tdee,
				proteinG: macros.proteinG,
				carbsG: macros.carbsG,
				fatG: macros.fatG,
			});
			setStep(3);
		})();
	}

	async function handleFinish() {
		form3.handleSubmit(async (data) => {
			setSaving(true);
			try {
				const s1 = form1.getValues();
				const s2 = form2.getValues();
				await api("/api/profile", {
					method: "PUT",
					body: JSON.stringify({
						age: s1.age,
						heightCm: s1.heightCm,
						weightKg: s1.weightKg,
						gender: s1.gender,
						activityLevel: s2.activityLevel,
						calorieTarget: data.calorieTarget,
						proteinTargetG: data.proteinG,
						carbsTargetG: data.carbsG,
						fatTargetG: data.fatG,
					}),
				});
				router.push("/dashboard");
				router.refresh();
			} catch (err) {
				console.error("Failed to save profile:", err);
			} finally {
				setSaving(false);
			}
		})();
	}

	return (
		<div className="flex min-h-[85vh] flex-col">
			{/* Top section: branding + stepper */}
			<FadeIn>
				<div className="pt-4 pb-6 space-y-5">
					{/* Logo */}
					<h1 className="text-center text-2xl font-extrabold tracking-tight text-on-surface">
						Bite
						<span className="text-primary">Buddy</span>
					</h1>

					{/* Step indicator — evenly spaced */}
					<div className="flex items-center px-4">
						{STEP_META.map((s, i) => (
							<div key={s.num} className="flex items-center flex-1 last:flex-none">
								{/* Circle + label */}
								<div className="flex items-center gap-2 shrink-0">
									<div
										className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
											step > s.num
												? "bg-primary text-white"
												: step === s.num
													? "bg-primary text-white shadow-md shadow-primary/25"
													: "bg-muted text-muted-foreground"
										}`}
									>
										{step > s.num ? (
											<Check className="size-3.5" />
										) : (
											s.num
										)}
									</div>
									<span
										className={`text-xs font-medium transition-colors ${
											step >= s.num
												? "text-on-surface"
												: "text-muted-foreground"
										}`}
									>
										{s.label}
									</span>
								</div>
								{/* Connector line */}
								{i < STEP_META.length - 1 && (
									<div
										className={`h-px flex-1 mx-3 transition-colors duration-300 ${
											step > s.num ? "bg-primary" : "bg-border"
										}`}
									/>
								)}
							</div>
						))}
					</div>
				</div>
			</FadeIn>

			{/* Step content */}
			<div className="flex-1 flex flex-col">
				<AnimatePresence mode="wait">
					{/* ─── Step 1: Body Stats ─── */}
					{step === 1 && (
						<SlideIn key="step1" direction="right">
							<div className="space-y-6">
								{/* Illustration + title */}
								<div className="text-center space-y-2">
									<div className="flex justify-center">
										<OnboardingBodyIllustration className="w-24 h-20 text-primary" />
									</div>
									<h2 className="text-xl font-bold text-on-surface">
										Tell us about yourself
									</h2>
									<p className="text-sm text-muted-foreground">
										We&apos;ll use this to calculate your daily needs
									</p>
								</div>

								{/* Form card */}
								<div className="bg-card rounded-2xl p-5 border border-outline-variant/10 shadow-[0_12px_32px_rgba(18,28,42,0.04)] space-y-5">
									{/* Gender toggle */}
									<div className="space-y-2">
										<Label className="text-sm font-medium text-on-surface">
											Gender
										</Label>
										<div className="grid grid-cols-2 gap-2">
											{(["male", "female"] as const).map((g) => {
												const selected = form1.watch("gender") === g;
												return (
													<button
														key={g}
														type="button"
														onClick={() => form1.setValue("gender", g)}
														className={`relative py-3.5 rounded-xl text-sm font-semibold capitalize transition-all duration-200 ${
															selected
																? "bg-primary text-white shadow-lg shadow-primary/20"
																: "bg-surface-container-low text-on-surface hover:bg-surface-container"
														}`}
													>
														{g}
													</button>
												);
											})}
										</div>
									</div>

									{/* Inputs */}
									<div className="space-y-4">
										<div className="space-y-1.5">
											<Label className="text-sm font-medium text-on-surface">
												Age
											</Label>
											<Input
												type="number"
												{...form1.register("age", { valueAsNumber: true })}
												className="h-12 rounded-xl bg-surface-container-low border-0 text-base px-4"
												placeholder="25"
											/>
											<FieldError
												message={form1.formState.errors.age?.message}
											/>
										</div>

										<div className="grid grid-cols-2 gap-3">
											<div className="space-y-1.5">
												<Label className="text-sm font-medium text-on-surface">
													Height
												</Label>
												<div className="relative">
													<Input
														type="number"
														{...form1.register("heightCm", {
															valueAsNumber: true,
														})}
														className="h-12 rounded-xl bg-surface-container-low border-0 text-base px-4 pr-10"
														placeholder="175"
													/>
													<span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
														cm
													</span>
												</div>
												<FieldError
													message={
														form1.formState.errors.heightCm?.message
													}
												/>
											</div>

											<div className="space-y-1.5">
												<Label className="text-sm font-medium text-on-surface">
													Weight
												</Label>
												<div className="relative">
													<Input
														type="number"
														step="0.1"
														{...form1.register("weightKg", {
															valueAsNumber: true,
														})}
														className="h-12 rounded-xl bg-surface-container-low border-0 text-base px-4 pr-10"
														placeholder="75"
													/>
													<span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
														kg
													</span>
												</div>
												<FieldError
													message={
														form1.formState.errors.weightKg?.message
													}
												/>
											</div>
										</div>
									</div>
								</div>

								{/* Continue */}
								<Button
									onClick={handleStep1Continue}
									type="button"
									className="w-full h-12 rounded-xl bg-primary text-white font-semibold text-base shadow-lg shadow-primary/20 hover:bg-primary/90"
								>
									Continue
									<ArrowRight className="ml-2 size-4" />
								</Button>
							</div>
						</SlideIn>
					)}

					{/* ─── Step 2: Activity Level ─── */}
					{step === 2 && (
						<SlideIn key="step2" direction="right">
							<div className="space-y-6">
								<div className="text-center space-y-2">
									<div className="flex justify-center">
										<OnboardingActivityIllustration className="w-24 h-20 text-primary" />
									</div>
									<h2 className="text-xl font-bold text-on-surface">
										How active are you?
									</h2>
									<p className="text-sm text-muted-foreground">
										This helps estimate your daily calorie burn
									</p>
								</div>

								<div className="space-y-2">
									{ACTIVITY_OPTIONS.map((option) => {
										const Icon = option.icon;
										const isSelected =
											form2.watch("activityLevel") === option.value;
										return (
											<button
												key={option.value}
												type="button"
												onClick={() =>
													form2.setValue("activityLevel", option.value)
												}
												className={`w-full flex items-center gap-3.5 p-3.5 rounded-xl text-left transition-all duration-200 ${
													isSelected
														? "bg-primary text-white shadow-lg shadow-primary/20"
														: "bg-card border border-outline-variant/10 shadow-[0_12px_32px_rgba(18,28,42,0.04)] hover:bg-surface-container"
												}`}
											>
												<div
													className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
														isSelected
															? "bg-white/25"
															: "bg-surface-container-low"
													}`}
												>
													<Icon
														className={`size-5 ${
															isSelected
																? "text-white"
																: "text-primary"
														}`}
													/>
												</div>
												<div className="min-w-0">
													<p className="font-semibold text-sm leading-tight">
														{option.label}
													</p>
													<p
														className={`text-xs mt-0.5 ${
															isSelected
																? "text-white/75"
																: "text-muted-foreground"
														}`}
													>
														{option.desc}
													</p>
												</div>
												{isSelected && (
													<motion.div
														initial={{ scale: 0 }}
														animate={{ scale: 1 }}
														className="ml-auto shrink-0"
													>
														<Check className="size-5 text-white" />
													</motion.div>
												)}
											</button>
										);
									})}
								</div>

								<div className="flex gap-3">
									<Button
										onClick={() => setStep(1)}
										type="button"
										variant="outline"
										className="h-12 rounded-xl px-5 bg-card border-outline-variant/10 hover:bg-surface-container"
									>
										<ArrowLeft className="size-4" />
									</Button>
									<Button
										onClick={handleStep2Continue}
										type="button"
										className="flex-1 h-12 rounded-xl bg-primary text-white font-semibold text-base shadow-lg shadow-primary/20 hover:bg-primary/90"
									>
										Continue
										<ArrowRight className="ml-2 size-4" />
									</Button>
								</div>
							</div>
						</SlideIn>
					)}

					{/* ─── Step 3: Daily Targets ─── */}
					{step === 3 && (
						<SlideIn key="step3" direction="right">
							<div className="space-y-6">
								<div className="text-center space-y-2">
									<div className="flex justify-center">
										<OnboardingTargetIllustration className="w-24 h-20 text-primary" />
									</div>
									<h2 className="text-xl font-bold text-on-surface">
										Your daily targets
									</h2>
									<p className="text-sm text-muted-foreground">
										Personalized for you &mdash; feel free to adjust
									</p>
								</div>

								{/* Calorie hero */}
								<div className="bg-primary rounded-2xl p-6 text-center text-white shadow-lg shadow-primary/20">
									<p className="text-xs font-semibold uppercase tracking-widest text-white/70 mb-1">
										Daily Calories
									</p>
									<div className="flex items-center justify-center gap-1">
										<Input
											type="number"
											{...form3.register("calorieTarget", {
												valueAsNumber: true,
											})}
											className="text-center text-4xl font-extrabold bg-transparent border-0 p-0 h-auto text-white w-32 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
										/>
									</div>
									<p className="text-sm text-white/60 mt-1">kcal / day</p>
									<FieldError
										message={
											form3.formState.errors.calorieTarget?.message
										}
									/>
								</div>

								{/* Macros row */}
								<div className="grid grid-cols-3 gap-3">
									{(
										[
											{
												label: "Protein",
												field: "proteinG" as const,
												text: "text-primary",
											},
											{
												label: "Carbs",
												field: "carbsG" as const,
												text: "text-secondary",
											},
											{
												label: "Fat",
												field: "fatG" as const,
												text: "text-tertiary",
											},
										] as const
									).map((macro) => (
										<div
											key={macro.label}
											className="bg-card rounded-xl p-4 text-center border border-outline-variant/10 shadow-[0_12px_32px_rgba(18,28,42,0.04)]"
										>
											<p
												className={`text-[11px] font-semibold uppercase tracking-wider ${macro.text} mb-2`}
											>
												{macro.label}
											</p>
											<Input
												type="number"
												{...form3.register(macro.field, {
													valueAsNumber: true,
												})}
												className={`text-center text-xl font-bold border-0 bg-transparent p-0 h-7 ${macro.text} [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none`}
											/>
											<p className="text-[11px] text-muted-foreground mt-1">
												grams
											</p>
											<FieldError
												message={
													form3.formState.errors[macro.field]?.message
												}
											/>
										</div>
									))}
								</div>

								<div className="flex gap-3">
									<Button
										onClick={() => setStep(2)}
										type="button"
										variant="outline"
										className="h-12 rounded-xl px-5 bg-card border-outline-variant/10 hover:bg-surface-container"
									>
										<ArrowLeft className="size-4" />
									</Button>
									<Button
										onClick={handleFinish}
										disabled={saving}
										type="button"
										className="flex-1 h-12 rounded-xl bg-primary text-white font-semibold text-base shadow-lg shadow-primary/20 hover:bg-primary/90"
									>
										{saving ? (
											<>
												<Loader2 className="mr-2 size-4 animate-spin" />
												Saving...
											</>
										) : (
											<>
												Start Tracking
												<ArrowRight className="ml-2 size-4" />
											</>
										)}
									</Button>
								</div>
							</div>
						</SlideIn>
					)}
				</AnimatePresence>
			</div>
		</div>
	);
}

"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { useDebounce } from "use-debounce";
import { api } from "@/lib/api";
import { signOut, useSession } from "@/lib/auth-client";
import { calculateDefaultMacros, calculateTDEE } from "@bitebuddy/shared";
import { Check, Loader2, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";

type Gender = "male" | "female";
type ActivityLevel =
	| "sedentary"
	| "lightly_active"
	| "moderately_active"
	| "very_active"
	| "extra_active";

const GENDER_LABELS: Record<Gender, string> = {
	male: "Male",
	female: "Female",
};

const ACTIVITY_LABELS: Record<ActivityLevel, string> = {
	sedentary: "Sedentary (little/no exercise)",
	lightly_active: "Lightly Active (1-3 days/week)",
	moderately_active: "Moderately Active (3-5 days/week)",
	very_active: "Very Active (6-7 days/week)",
	extra_active: "Extra Active (athlete)",
};

export default function ProfilePage() {
	const router = useRouter();
	const { data: session } = useSession();
	const [loaded, setLoaded] = useState(false);
	const hasSettled = useRef(false);
	const [saveStatus, setSaveStatus] = useState<
		"idle" | "saving" | "saved"
	>("idle");

	const [age, setAge] = useState(25);
	const [heightCm, setHeightCm] = useState(175);
	const [weightKg, setWeightKg] = useState(75);
	const [gender, setGender] = useState<Gender>("male");
	const [activityLevel, setActivityLevel] =
		useState<ActivityLevel>("moderately_active");
	const [calorieTarget, setCalorieTarget] = useState(2000);
	const [proteinG, setProteinG] = useState(150);
	const [carbsG, setCarbsG] = useState(200);
	const [fatG, setFatG] = useState(67);

	// Load profile on mount
	useEffect(() => {
		api("/api/profile")
			.then((profile: any) => {
				if (profile) {
					setAge(profile.age ?? 25);
					setHeightCm(profile.heightCm ?? 175);
					setWeightKg(profile.weightKg ?? 75);
					setGender(profile.gender ?? "male");
					setActivityLevel(profile.activityLevel ?? "moderately_active");
					setCalorieTarget(profile.calorieTarget ?? 2000);
					setProteinG(profile.proteinTargetG ?? 150);
					setCarbsG(profile.carbsTargetG ?? 200);
					setFatG(profile.fatTargetG ?? 67);
				}
				setLoaded(true);
			})
			.catch(console.error);
	}, []);

	// Auto-recalculate TDEE when body metrics change
	useEffect(() => {
		if (!loaded) return;
		const tdee = calculateTDEE(weightKg, heightCm, age, gender, activityLevel);
		setCalorieTarget(tdee);
		const macros = calculateDefaultMacros(tdee);
		setProteinG(macros.proteinG);
		setCarbsG(macros.carbsG);
		setFatG(macros.fatG);
	}, [weightKg, heightCm, age, gender, activityLevel, loaded]);

	// Build profile data object for debouncing
	const profileData = useMemo(
		() => ({
			age,
			heightCm,
			weightKg,
			gender,
			activityLevel,
			calorieTarget,
			proteinTargetG: proteinG,
			carbsTargetG: carbsG,
			fatTargetG: fatG,
		}),
		[age, heightCm, weightKg, gender, activityLevel, calorieTarget, proteinG, carbsG, fatG],
	);

	const [debouncedProfile] = useDebounce(profileData, 1000);

	// Auto-save when debounced profile changes
	useEffect(() => {
		if (!loaded) return;
		// Skip the first render after load settles
		if (!hasSettled.current) {
			hasSettled.current = true;
			return;
		}

		let cancelled = false;
		setSaveStatus("saving");

		api("/api/profile", {
			method: "PUT",
			body: JSON.stringify(debouncedProfile),
		})
			.then(() => {
				if (cancelled) return;
				setSaveStatus("saved");
				setTimeout(() => {
					if (!cancelled) setSaveStatus("idle");
				}, 2000);
			})
			.catch((err) => {
				console.error("Auto-save failed:", err);
				if (!cancelled) setSaveStatus("idle");
			});

		return () => {
			cancelled = true;
		};
	}, [debouncedProfile, loaded]);

	async function handleSignOut() {
		await signOut();
		router.push("/login");
	}

	if (!loaded) {
		return (
			<div className="text-center py-8 text-on-surface-variant animate-pulse">
				Loading...
			</div>
		);
	}

	return (
		<div className="space-y-4">
			{/* Header */}
			<div className="flex items-center justify-between">
				<h1 className="text-2xl font-bold text-foreground">Profile</h1>
				{saveStatus === "saving" && (
					<span className="flex items-center gap-1.5 text-xs text-on-surface-variant animate-pulse">
						<Loader2 className="size-3 animate-spin" />
						Saving...
					</span>
				)}
				{saveStatus === "saved" && (
					<span className="flex items-center gap-1.5 text-xs text-primary">
						<Check className="size-3" />
						Saved
					</span>
				)}
			</div>

			{/* User card */}
			{session?.user && (
				<div className="rounded-2xl bg-card p-4 shadow-sm ring-1 ring-foreground/5 flex items-center gap-3">
					<div className="size-12 rounded-xl bg-gradient-to-br from-primary to-primary-container flex items-center justify-center text-white text-lg font-bold shrink-0">
						{session.user.name?.charAt(0)?.toUpperCase() ?? "U"}
					</div>
					<div className="min-w-0 flex-1">
						<p className="font-semibold text-foreground truncate">
							{session.user.name}
						</p>
						<p className="text-xs text-on-surface-variant truncate">
							{session.user.email}
						</p>
					</div>
				</div>
			)}

			{/* Body Metrics */}
			<section className="rounded-2xl bg-card p-4 shadow-sm ring-1 ring-foreground/5 space-y-3">
				<h2 className="font-semibold text-foreground">Body Metrics</h2>

				<div className="grid grid-cols-2 gap-3">
					<div className="space-y-1.5">
						<Label className="text-xs text-on-surface-variant">Age</Label>
						<Input
							type="number"
							value={age}
							onChange={(e) => setAge(Number(e.target.value))}
							className="bg-surface-container-low border-0 rounded-xl h-11"
						/>
					</div>
					<div className="space-y-1.5">
						<Label className="text-xs text-on-surface-variant">
							Height (cm)
						</Label>
						<Input
							type="number"
							value={heightCm}
							onChange={(e) => setHeightCm(Number(e.target.value))}
							className="bg-surface-container-low border-0 rounded-xl h-11"
						/>
					</div>
					<div className="space-y-1.5">
						<Label className="text-xs text-on-surface-variant">
							Weight (kg)
						</Label>
						<Input
							type="number"
							value={weightKg}
							onChange={(e) => setWeightKg(Number(e.target.value))}
							className="bg-surface-container-low border-0 rounded-xl h-11"
						/>
					</div>
					<div className="space-y-1.5">
						<Label className="text-xs text-on-surface-variant">Gender</Label>
						<Select
							value={gender}
							onValueChange={(v) => setGender(v as Gender)}
						>
							<SelectTrigger className="w-full h-11 rounded-xl bg-surface-container-low border-0">
								<SelectValue placeholder="Select gender">
									{GENDER_LABELS[gender]}
								</SelectValue>
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="male">Male</SelectItem>
								<SelectItem value="female">Female</SelectItem>
							</SelectContent>
						</Select>
					</div>
				</div>

				<div className="space-y-1.5">
					<Label className="text-xs text-on-surface-variant">
						Activity Level
					</Label>
					<Select
						value={activityLevel}
						onValueChange={(v) => setActivityLevel(v as ActivityLevel)}
					>
						<SelectTrigger className="w-full h-11 rounded-xl bg-surface-container-low border-0 text-sm">
							<SelectValue placeholder="Select activity level">
								{ACTIVITY_LABELS[activityLevel]}
							</SelectValue>
						</SelectTrigger>
						<SelectContent>
							{Object.entries(ACTIVITY_LABELS).map(([value, label]) => (
								<SelectItem key={value} value={value}>
									{label}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>
			</section>

			{/* Nutrition Targets */}
			<section className="rounded-2xl bg-card p-4 shadow-sm ring-1 ring-foreground/5 space-y-3">
				<h2 className="font-semibold text-foreground">Nutrition Targets</h2>

				<div className="bg-gradient-to-br from-primary/5 to-primary-container/10 rounded-xl py-4 px-3 flex flex-col items-center gap-0.5">
					<span className="text-[10px] text-on-surface-variant uppercase tracking-widest font-semibold">
						Daily Calories
					</span>
					<Input
						type="number"
						value={calorieTarget}
						onChange={(e) => setCalorieTarget(Number(e.target.value))}
						className="text-center text-3xl font-bold border-0 bg-transparent p-0 h-10 w-full text-primary focus-visible:ring-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
					/>
					<span className="text-xs text-on-surface-variant">kcal</span>
				</div>

				<div className="grid grid-cols-3 gap-2">
					{[
						{
							label: "Protein",
							value: proteinG,
							setter: setProteinG,
							color: "text-primary",
						},
						{
							label: "Carbs",
							value: carbsG,
							setter: setCarbsG,
							color: "text-secondary",
						},
						{
							label: "Fat",
							value: fatG,
							setter: setFatG,
							color: "text-tertiary",
						},
					].map((macro) => (
						<div
							key={macro.label}
							className="bg-surface-container-low rounded-xl py-2.5 px-2 flex flex-col items-center gap-0.5"
						>
							<span className="text-[11px] text-on-surface-variant">
								{macro.label}
							</span>
							<Input
								type="number"
								value={macro.value}
								onChange={(e) => macro.setter(Number(e.target.value))}
								className={`text-center text-lg font-bold border-0 bg-transparent p-0 h-7 w-full focus-visible:ring-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${macro.color}`}
							/>
							<span className="text-[10px] text-outline">grams</span>
						</div>
					))}
				</div>
			</section>

			{/* Sign Out */}
			<div className="pt-1">
				<Button
					variant="ghost"
					onClick={handleSignOut}
					className="w-full h-10 gap-2 rounded-full text-destructive text-sm hover:bg-transparent hover:text-destructive"
				>
					<LogOut className="size-4" />
					Sign Out
				</Button>
			</div>
		</div>
	);
}

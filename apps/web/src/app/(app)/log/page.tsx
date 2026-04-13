"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/api";
import type { FoodAnalysisResult } from "@bitebuddy/shared";
import { compressImage } from "@/lib/compress-image";
import {
	AlertTriangle,
	ArrowLeft,
	Camera,
	ChevronRight,
	ImagePlus,
	ListPlus,
	Minus,
	PenLine,
	Plus,
	RotateCcw,
	ShieldCheck,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";

type MealType = "breakfast" | "lunch" | "dinner" | "snack";

export default function LogPage() {
	const router = useRouter();
	const fileInputRef = useRef<HTMLInputElement>(null);
	const galleryInputRef = useRef<HTMLInputElement>(null);
	const [mode, setMode] = useState<"choose" | "photo" | "manual">("choose");
	const [analyzing, setAnalyzing] = useState(false);
	const [analysisError, setAnalysisError] = useState<string | null>(null);
	const [analysis, setAnalysis] = useState<FoodAnalysisResult | null>(null);
	const [previewUrl, setPreviewUrl] = useState<string | null>(null);
	const [mealType, setMealType] = useState<MealType>("lunch");
	const [saving, setSaving] = useState(false);

	const [multipliers, setMultipliers] = useState<number[]>([]);

	const [manualName, setManualName] = useState("");
	const [manualCalories, setManualCalories] = useState("");
	const [manualProtein, setManualProtein] = useState("");
	const [manualCarbs, setManualCarbs] = useState("");
	const [manualFat, setManualFat] = useState("");

	async function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
		const file = e.target.files?.[0];
		if (!file) return;

		const url = URL.createObjectURL(file);
		setPreviewUrl(url);
		setMode("photo");
		setAnalyzing(true);
		setAnalysisError(null);

		try {
			const base64 = await compressImage(file);
			const result = await api<FoodAnalysisResult>("/api/analyze", {
				method: "POST",
				body: JSON.stringify({ image: base64 }),
			});
			setAnalysis(result);
			setMultipliers(result.items.map(() => 1));
		} catch (err) {
			const message = err instanceof Error ? err.message : "Analysis failed";
			setAnalysisError(message);
		} finally {
			setAnalyzing(false);
		}
	}

	async function handleSaveAnalysis() {
		if (!analysis) return;
		setSaving(true);
		const today = new Date().toISOString().split("T")[0];

		try {
			for (const item of analysis.items) {
				await api("/api/food-log", {
					method: "POST",
					body: JSON.stringify({
						date: today,
						mealType,
						name: item.name,
						calories: item.calories,
						proteinG: item.proteinG,
						carbsG: item.carbsG,
						fatG: item.fatG,
						servingSize: item.estimatedPortion,
						source: "ai_photo",
						aiRawResponse: analysis,
					}),
				});
			}
			router.push("/diary");
		} catch (err) {
			console.error("Save failed:", err);
		} finally {
			setSaving(false);
		}
	}

	async function handleSaveManual() {
		setSaving(true);
		const today = new Date().toISOString().split("T")[0];

		try {
			await api("/api/food-log", {
				method: "POST",
				body: JSON.stringify({
					date: today,
					mealType,
					name: manualName,
					calories: Number(manualCalories) || 0,
					proteinG: Number(manualProtein) || 0,
					carbsG: Number(manualCarbs) || 0,
					fatG: Number(manualFat) || 0,
					source: "manual",
				}),
			});
			router.push("/diary");
		} catch (err) {
			console.error("Save failed:", err);
		} finally {
			setSaving(false);
		}
	}

	function updateAnalysisItem(index: number, field: string, value: number) {
		if (!analysis) return;
		const items = [...analysis.items];
		items[index] = { ...items[index], [field]: value };
		const totalCalories = items.reduce((sum, i) => sum + i.calories, 0);
		const totalProteinG = items.reduce((sum, i) => sum + i.proteinG, 0);
		const totalCarbsG = items.reduce((sum, i) => sum + i.carbsG, 0);
		const totalFatG = items.reduce((sum, i) => sum + i.fatG, 0);
		setAnalysis({ ...analysis, items, totalCalories, totalProteinG, totalCarbsG, totalFatG });
	}

	function setItemMultiplier(index: number, newMultiplier: number) {
		if (!analysis || newMultiplier < 1) return;
		const oldMultiplier = multipliers[index] || 1;
		const ratio = newMultiplier / oldMultiplier;

		const items = [...analysis.items];
		items[index] = {
			...items[index],
			calories: Math.round(items[index].calories * ratio),
			proteinG: Math.round(items[index].proteinG * ratio * 10) / 10,
			carbsG: Math.round(items[index].carbsG * ratio * 10) / 10,
			fatG: Math.round(items[index].fatG * ratio * 10) / 10,
		};

		const totalCalories = items.reduce((sum, i) => sum + i.calories, 0);
		const totalProteinG = items.reduce((sum, i) => sum + i.proteinG, 0);
		const totalCarbsG = items.reduce((sum, i) => sum + i.carbsG, 0);
		const totalFatG = items.reduce((sum, i) => sum + i.fatG, 0);
		setAnalysis({ ...analysis, items, totalCalories, totalProteinG, totalCarbsG, totalFatG });

		const newMultipliers = [...multipliers];
		newMultipliers[index] = newMultiplier;
		setMultipliers(newMultipliers);
	}

	// Choose mode
	if (mode === "choose") {
		return (
			<div className="space-y-6">
				{/* Camera Viewfinder Card */}
				<section
					className="relative w-full aspect-[4/5] rounded-[40px] overflow-hidden bg-black shadow-2xl border border-white/10 group cursor-pointer"
					onClick={() => fileInputRef.current?.click()}
				>
					<img
						alt="Vibrant healthy food photography"
						className="absolute inset-0 w-full h-full object-cover"
						src="https://lh3.googleusercontent.com/aida-public/AB6AXuClOqmQe2YlqdEYOD_5VgZv4pZlg5Uu6QFvyNCmB5EhDdEygkJmioHcJYA5UI_hDIVJTsoIeaesw3-NqtBkPszFnmkno_f2GIrvvnM1-_b3jHerMdq519EysA8zZISSa7a1bB570NWRDgCnfZrkZwAgCf14LgTbjWtu3Gz6ymcrvk20Lw002jDF-1PaJc6SADow9tlUt_a63K1mhyoSABNYlJy23pWDm7me9IkyRaZBSVvKupT86_wS5WVVXhz1At6ArqKvYizwMwI"
					/>
					{/* Vignette overlay */}
					<div className="absolute inset-0" style={{ background: "radial-gradient(circle, transparent 40%, rgba(0,0,0,0.3) 100%)" }} />
					{/* Viewfinder corners */}
					<div className="absolute inset-10 border border-white/20 rounded-2xl pointer-events-none">
						<div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-white/60 -m-1" />
						<div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-white/60 -m-1" />
						<div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-white/60 -m-1" />
						<div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-white/60 -m-1" />
					</div>
					<div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center">
						{/* Auto-Detection badge */}
						<div className="mb-auto mt-4 backdrop-blur-md bg-white/10 px-4 py-1.5 rounded-full border border-white/20">
							<p className="text-white text-xs font-bold tracking-widest uppercase">Auto-Detection Active</p>
						</div>
						{/* Shutter button */}
						<div className="space-y-4">
							<div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-xl border border-white/30 flex items-center justify-center group-hover:scale-105 transition-all duration-500 active:scale-90">
								<div className="w-16 h-16 rounded-full border-4 border-white flex items-center justify-center">
									<div className="w-12 h-12 rounded-full bg-white" />
								</div>
							</div>
							<div className="space-y-1">
								<p className="font-bold text-white text-2xl drop-shadow-lg">Snap your plate</p>
								<p className="text-white/80 text-sm drop-shadow-md">AI will analyze your nutrition instantly</p>
							</div>
						</div>
						{/* Gallery button */}
						<button
							type="button"
							onClick={(e) => {
								e.stopPropagation();
								galleryInputRef.current?.click();
							}}
							className="mt-auto mb-4 px-6 py-3 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white rounded-2xl font-semibold border border-white/20 transition-all flex items-center gap-2"
						>
							<ImagePlus className="size-4" />
							Choose from Gallery
						</button>
					</div>
				</section>
				{/* Camera input (mobile: opens camera directly) */}
				<input
					ref={fileInputRef}
					type="file"
					accept="image/*"
					capture="environment"
					onChange={handleFileSelect}
					className="hidden"
				/>
				{/* Gallery input (opens file picker / photo library) */}
				<input
					ref={galleryInputRef}
					type="file"
					accept="image/*"
					onChange={handleFileSelect}
					className="hidden"
				/>

				{/* Meal type tabs */}
				<div className="flex gap-1 bg-surface-container-low rounded-[28px] p-1.5">
					{(["breakfast", "lunch", "dinner", "snack"] as const).map((type) => (
						<button
							key={type}
							type="button"
							onClick={() => setMealType(type)}
							className={`flex-1 py-3 text-center rounded-2xl text-sm tracking-wide transition-all capitalize ${
								mealType === type
									? "bg-white text-primary font-bold shadow-sm"
									: "text-on-surface-variant font-medium hover:bg-white/50"
							}`}
						>
							{type}
						</button>
					))}
				</div>

				{/* Manual entry */}
				<button
					type="button"
					onClick={() => setMode("manual")}
					className="w-full py-4 text-on-surface-variant font-semibold text-sm bg-surface-container-high/40 rounded-[20px] hover:bg-surface-container-high transition-colors flex items-center justify-center gap-2"
				>
					<ListPlus className="size-5" />
					Add Items Manually
				</button>
			</div>
		);
	}

	// Photo analysis mode
	if (mode === "photo") {
		return (
			<div className="space-y-4">
				<button
					type="button"
					onClick={() => {
						setMode("choose");
						setAnalysis(null);
						setPreviewUrl(null);
					}}
					className="flex items-center gap-1 text-sm text-on-surface-variant font-medium hover:text-foreground transition-colors"
				>
					<ArrowLeft className="size-4" />
					Back
				</button>

				{previewUrl && (
					<div className="relative rounded-3xl overflow-hidden">
						<img
							src={previewUrl}
							alt="Meal"
							className="w-full max-h-64 object-cover"
						/>
						<div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
					</div>
				)}

				{analyzing && (
					<div className="text-center py-10">
						<div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-primary-container flex items-center justify-center mx-auto mb-3 animate-pulse">
							<Camera className="size-6 text-white" />
						</div>
						<p className="text-on-surface-variant font-medium">
							Analyzing your meal...
						</p>
					</div>
				)}

				{analysisError && (
					<div className="bg-destructive/10 text-destructive text-sm p-4 rounded-2xl">
						{analysisError}
					</div>
				)}

				{analysis && analysis.totalCalories === 0 && analysis.items.length === 0 && (
					<div className="bg-card rounded-3xl p-6 shadow-[0_12px_32px_rgba(18,28,42,0.04)] border border-outline-variant/10 text-center space-y-4">
						<div className="w-14 h-14 rounded-2xl bg-destructive/10 flex items-center justify-center mx-auto">
							<AlertTriangle className="size-7 text-destructive" />
						</div>
						<div className="space-y-1">
							<h2 className="font-bold text-foreground text-lg">No food detected</h2>
							<p className="text-sm text-on-surface-variant">
								We couldn't identify any food items in this photo. Make sure the food is clearly visible and well-lit.
							</p>
						</div>
						<div className="flex gap-3">
							<Button
								variant="outline"
								onClick={() => {
									setMode("choose");
									setAnalysis(null);
									setPreviewUrl(null);
								}}
								className="flex-1 rounded-full h-11"
							>
								<RotateCcw className="mr-1.5 size-4" />
								Try Again
							</Button>
							<Button
								onClick={() => {
									setMode("manual");
									setAnalysis(null);
								}}
								className="flex-1 rounded-full h-11"
							>
								<PenLine className="mr-1.5 size-4" />
								Enter Manually
							</Button>
						</div>
					</div>
				)}

				{analysis && (analysis.totalCalories > 0 || analysis.items.length > 0) && (
					<div className="space-y-4">
						{/* Confidence badge */}
						<div className="flex items-center justify-between">
							<h2 className="font-bold text-foreground">Analysis Results</h2>
							<span
								className={`text-xs px-3 py-1 rounded-full font-semibold flex items-center gap-1 ${
									analysis.confidence === "high"
										? "bg-primary/10 text-primary"
										: analysis.confidence === "medium"
											? "bg-tertiary/10 text-tertiary"
											: "bg-destructive/10 text-destructive"
								}`}
							>
								<ShieldCheck className="size-3" />
								{analysis.confidence === "high"
									? "98%"
									: analysis.confidence === "medium"
										? "85%"
										: "70%"}{" "}
								Precise
							</span>
						</div>

						{/* Totals summary card */}
						<div className="bg-card rounded-3xl p-5 shadow-[0_12px_32px_rgba(18,28,42,0.04)] border border-outline-variant/10">
							<div className="text-center mb-3">
								<p className="text-3xl font-bold text-foreground">
									{Math.round(analysis.totalCalories)}{" "}
									<span className="text-sm font-normal text-on-surface-variant">
										kcal
									</span>
								</p>
							</div>
							<div className="grid grid-cols-3 gap-2">
								<div className="bg-primary/5 rounded-xl p-2.5 text-center">
									<p className="text-sm font-bold text-primary">
										{Math.round(analysis.totalProteinG)}g
									</p>
									<p className="text-[10px] text-on-surface-variant">
										Protein
									</p>
								</div>
								<div className="bg-secondary/5 rounded-xl p-2.5 text-center">
									<p className="text-sm font-bold text-secondary">
										{Math.round(analysis.totalCarbsG)}g
									</p>
									<p className="text-[10px] text-on-surface-variant">
										Carbs
									</p>
								</div>
								<div className="bg-tertiary/5 rounded-xl p-2.5 text-center">
									<p className="text-sm font-bold text-tertiary">
										{Math.round(analysis.totalFatG)}g
									</p>
									<p className="text-[10px] text-on-surface-variant">Fat</p>
								</div>
							</div>
						</div>

						{/* Individual items */}
						{analysis.items.map((item, i) => (
							<div
								key={i}
								className="bg-card rounded-2xl p-4 shadow-[0_12px_32px_rgba(18,28,42,0.04)] border border-outline-variant/10"
							>
								<div className="flex items-start justify-between mb-3">
									<div>
										<p className="font-semibold text-sm text-foreground">
											{item.name}
										</p>
										<p className="text-xs text-on-surface-variant">
											{item.estimatedPortion}
										</p>
									</div>
									<div className="flex items-center gap-1.5">
										<button
											type="button"
											onClick={() => setItemMultiplier(i, (multipliers[i] || 1) - 1)}
											disabled={(multipliers[i] || 1) <= 1}
											className="w-7 h-7 rounded-lg bg-surface-container-low flex items-center justify-center text-on-surface-variant hover:bg-surface-container-high transition-colors disabled:opacity-30"
										>
											<Minus className="size-3.5" />
										</button>
										<span className="text-sm font-bold text-foreground w-5 text-center tabular-nums">
											{multipliers[i] || 1}
										</span>
										<button
											type="button"
											onClick={() => setItemMultiplier(i, (multipliers[i] || 1) + 1)}
											className="w-7 h-7 rounded-lg bg-surface-container-low flex items-center justify-center text-on-surface-variant hover:bg-surface-container-high transition-colors"
										>
											<Plus className="size-3.5" />
										</button>
									</div>
								</div>
								<div className="grid grid-cols-4 gap-2">
									<div>
										<Label className="text-[10px] text-on-surface-variant">
											Cal
										</Label>
										<Input
											type="number"
											value={item.calories}
											onChange={(e) =>
												updateAnalysisItem(
													i,
													"calories",
													Number(e.target.value),
												)
											}
											className="text-sm bg-surface-container-low border-0 rounded-xl h-10"
										/>
									</div>
									<div>
										<Label className="text-[10px] text-on-surface-variant">
											Protein
										</Label>
										<Input
											type="number"
											value={item.proteinG}
											onChange={(e) =>
												updateAnalysisItem(
													i,
													"proteinG",
													Number(e.target.value),
												)
											}
											className="text-sm bg-surface-container-low border-0 rounded-xl h-10"
										/>
									</div>
									<div>
										<Label className="text-[10px] text-on-surface-variant">
											Carbs
										</Label>
										<Input
											type="number"
											value={item.carbsG}
											onChange={(e) =>
												updateAnalysisItem(
													i,
													"carbsG",
													Number(e.target.value),
												)
											}
											className="text-sm bg-surface-container-low border-0 rounded-xl h-10"
										/>
									</div>
									<div>
										<Label className="text-[10px] text-on-surface-variant">
											Fat
										</Label>
										<Input
											type="number"
											value={item.fatG}
											onChange={(e) =>
												updateAnalysisItem(
													i,
													"fatG",
													Number(e.target.value),
												)
											}
											className="text-sm bg-surface-container-low border-0 rounded-xl h-10"
										/>
									</div>
								</div>
							</div>
						))}

						<Button
							onClick={handleSaveAnalysis}
							disabled={saving}
							className="w-full rounded-full h-12"
						>
							{saving ? "Saving..." : "Save Log Entry"}
							{!saving && <ChevronRight className="ml-1 size-4" />}
						</Button>
					</div>
				)}
			</div>
		);
	}

	// Manual entry mode
	return (
		<div className="space-y-5">
			<button
				type="button"
				onClick={() => setMode("choose")}
				className="flex items-center gap-1 text-sm text-on-surface-variant font-medium hover:text-foreground transition-colors"
			>
				<ArrowLeft className="size-4" />
				Back
			</button>

			<h1 className="text-2xl font-bold text-foreground">Manual Entry</h1>

			<div className="bg-card rounded-3xl p-5 shadow-[0_12px_32px_rgba(18,28,42,0.04)] border border-outline-variant/10 space-y-4">
				<div>
					<Label className="mb-1 text-sm text-on-surface-variant">
						Food Name
					</Label>
					<Input
						type="text"
						value={manualName}
						onChange={(e) => setManualName(e.target.value)}
						placeholder="e.g., Chicken breast"
						className="bg-surface-container-low border-0 rounded-xl h-12"
					/>
				</div>
				<div>
					<Label className="mb-1 text-sm text-on-surface-variant">
						Calories
					</Label>
					<Input
						type="number"
						value={manualCalories}
						onChange={(e) => setManualCalories(e.target.value)}
						placeholder="0"
						className="bg-surface-container-low border-0 rounded-xl h-12"
					/>
				</div>
				<div className="grid grid-cols-3 gap-3">
					<div>
						<Label className="mb-1 text-sm text-on-surface-variant">
							Protein (g)
						</Label>
						<Input
							type="number"
							value={manualProtein}
							onChange={(e) => setManualProtein(e.target.value)}
							placeholder="0"
							className="bg-surface-container-low border-0 rounded-xl h-12"
						/>
					</div>
					<div>
						<Label className="mb-1 text-sm text-on-surface-variant">
							Carbs (g)
						</Label>
						<Input
							type="number"
							value={manualCarbs}
							onChange={(e) => setManualCarbs(e.target.value)}
							placeholder="0"
							className="bg-surface-container-low border-0 rounded-xl h-12"
						/>
					</div>
					<div>
						<Label className="mb-1 text-sm text-on-surface-variant">
							Fat (g)
						</Label>
						<Input
							type="number"
							value={manualFat}
							onChange={(e) => setManualFat(e.target.value)}
							placeholder="0"
							className="bg-surface-container-low border-0 rounded-xl h-12"
						/>
					</div>
				</div>
			</div>

			<Button
				onClick={handleSaveManual}
				disabled={saving || !manualName}
				className="w-full rounded-full h-12"
			>
				{saving ? "Saving..." : "Save to Diary"}
				{!saving && <ChevronRight className="ml-1 size-4" />}
			</Button>
		</div>
	);
}

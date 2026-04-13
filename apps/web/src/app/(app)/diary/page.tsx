"use client";

import { EmptyPlateIllustration } from "@/components/illustrations";
import { FadeIn } from "@/components/motion";
import { DiarySkeleton } from "@/components/skeletons/diary-skeleton";
import { api } from "@/lib/api";
import { AnimatePresence, motion } from "framer-motion";
import {
	ChevronLeft,
	ChevronRight,
	Cookie,
	Moon,
	Plus,
	Sun,
	Sunrise,
	X,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

interface FoodLogEntry {
	id: string;
	date: string;
	mealType: string;
	name: string;
	calories: number;
	proteinG: number;
	carbsG: number;
	fatG: number;
	photoUrl: string | null;
	source: string;
}

const MEAL_TYPES = ["breakfast", "lunch", "dinner", "snack"] as const;

const MEAL_CONFIG: Record<
	string,
	{ icon: typeof Sunrise; label: string; color: string }
> = {
	breakfast: {
		icon: Sunrise,
		label: "Breakfast",
		color: "text-tertiary-container bg-tertiary/10",
	},
	lunch: {
		icon: Sun,
		label: "Lunch",
		color: "text-secondary bg-secondary/10",
	},
	dinner: {
		icon: Moon,
		label: "Dinner",
		color: "text-primary bg-primary/10",
	},
	snack: {
		icon: Cookie,
		label: "Snacks",
		color: "text-tertiary bg-tertiary/10",
	},
};

export default function DiaryPage() {
	const today = new Date().toISOString().split("T")[0];
	const [date, setDate] = useState(() => today);
	const [entries, setEntries] = useState<FoodLogEntry[]>([]);
	const [loading, setLoading] = useState(true);
	const [initialLoad, setInitialLoad] = useState(true);
	const [direction, setDirection] = useState(0); // -1 = backward, 1 = forward
	const dragRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (initialLoad) setLoading(true);
		api<FoodLogEntry[]>(`/api/food-log?date=${date}`)
			.then(setEntries)
			.catch(console.error)
			.finally(() => {
				setLoading(false);
				setInitialLoad(false);
			});
	}, [date]);

	const grouped = MEAL_TYPES.reduce(
		(acc, type) => {
			acc[type] = entries.filter((e) => e.mealType === type);
			return acc;
		},
		{} as Record<string, FoodLogEntry[]>,
	);

	const totals = entries.reduce(
		(acc, e) => ({
			calories: acc.calories + e.calories,
			protein: acc.protein + e.proteinG,
			carbs: acc.carbs + e.carbsG,
			fat: acc.fat + e.fatG,
		}),
		{ calories: 0, protein: 0, carbs: 0, fat: 0 },
	);

	function changeDate(offset: number) {
		setDirection(offset > 0 ? 1 : -1);
		const d = new Date(date + "T12:00:00");
		d.setDate(d.getDate() + offset);
		setDate(d.toISOString().split("T")[0]);
	}

	function handleDragEnd(_: unknown, info: { offset: { x: number }; velocity: { x: number } }) {
		const swipe = info.offset.x * info.velocity.x;
		if (swipe < -5000 || info.offset.x < -80) {
			changeDate(1);
		} else if (swipe > 5000 || info.offset.x > 80) {
			changeDate(-1);
		}
	}

	async function handleDelete(id: string) {
		await api(`/api/food-log/${id}`, { method: "DELETE" });
		setEntries((prev) => prev.filter((e) => e.id !== id));
	}

	const currentDate = new Date(date + "T12:00:00");
	const monthYear = currentDate.toLocaleDateString("en-US", { month: "long", year: "numeric" });
	const dayOfWeek = currentDate.toLocaleDateString("en-US", { weekday: "long" });
	const dayNum = currentDate.getDate();
	const ordinal = dayNum === 1 || dayNum === 21 || dayNum === 31 ? "st" : dayNum === 2 || dayNum === 22 ? "nd" : dayNum === 3 || dayNum === 23 ? "rd" : "th";

	const isToday = date === today;

	// Generate surrounding days for week picker
	const weekDays = Array.from({ length: 7 }, (_, i) => {
		const d = new Date(currentDate);
		d.setDate(d.getDate() + (i - 3));
		return d;
	});

	const todayDate = new Date(today + "T12:00:00");

	const slideVariants = {
		enter: (dir: number) => ({ x: dir > 0 ? 60 : -60, opacity: 0 }),
		center: { x: 0, opacity: 1 },
		exit: (dir: number) => ({ x: dir > 0 ? -60 : 60, opacity: 0 }),
	};

	return (
		<div className="space-y-4">
			{/* Date Navigation - Calendar Style */}
			<section className="bg-white rounded-2xl shadow-sm border border-surface-container p-4">
				<div className="flex items-center justify-between mb-4">
					<button type="button" onClick={() => changeDate(-1)} className="p-2 hover:bg-surface-container-low rounded-full transition-colors">
						<ChevronLeft className="size-5 text-outline" />
					</button>
					<div className="flex flex-col items-center">
						<span className="text-[10px] font-bold uppercase tracking-widest text-primary mb-0.5">{monthYear.split(" ")[0].toUpperCase()} {monthYear.split(" ")[1]}</span>
						<h2 className="font-bold text-base text-on-surface">{dayOfWeek}, {dayNum}{ordinal}</h2>
						{!isToday && (
							<button
								type="button"
								onClick={() => {
									setDirection(date > today ? -1 : 1);
									setDate(today);
								}}
								className="mt-1 text-[10px] font-bold text-primary bg-primary/10 px-3 py-0.5 rounded-full"
							>
								Today
							</button>
						)}
					</div>
					<button type="button" onClick={() => changeDate(1)} className="p-2 hover:bg-surface-container-low rounded-full transition-colors">
						<ChevronRight className="size-5 text-outline" />
					</button>
				</div>
				{/* Quick day picker */}
				<div className="flex justify-between px-1">
					{weekDays.map((d) => {
						const isSelected = d.toDateString() === currentDate.toDateString();
						const isDayToday = d.toDateString() === todayDate.toDateString();
						return (
							<div key={d.toISOString()} className="flex flex-col items-center gap-1.5">
								<span className={`text-[10px] font-medium ${isSelected ? "text-primary" : isDayToday ? "text-primary/70" : "text-outline"}`}>
									{d.toLocaleDateString("en-US", { weekday: "short" })}
								</span>
								<button
									type="button"
									onClick={() => {
										const targetDate = d.toISOString().split("T")[0];
										if (targetDate !== date) {
											setDirection(targetDate > date ? 1 : -1);
											setDate(targetDate);
										}
									}}
									className={`w-10 h-10 flex items-center justify-center rounded-full text-sm font-semibold transition-all relative ${
										isSelected
											? "bg-primary text-white shadow-md shadow-primary/20"
											: isDayToday
												? "text-primary font-bold ring-2 ring-primary/30 hover:bg-primary/5"
												: "text-on-surface hover:bg-surface-container-low"
									}`}
								>
									{d.getDate()}
									{isDayToday && !isSelected && (
										<span className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary" />
									)}
								</button>
							</div>
						);
					})}
				</div>
			</section>

			{/* Calorie Summary Card */}
			<div className="bg-card rounded-3xl p-5 shadow-[0_12px_32px_rgba(18,28,42,0.04)] border border-outline-variant/10">
				<div className="text-center mb-3">
					<p className="text-xs text-on-surface-variant uppercase tracking-wider font-semibold">
						Calories Consumed
					</p>
					<p className="text-3xl font-bold text-foreground">
						{Math.round(totals.calories)}
					</p>
				</div>
				<div className="grid grid-cols-3 gap-2">
					<div className="bg-primary/5 rounded-xl p-2.5 text-center">
						<p className="text-sm font-bold text-primary">
							{Math.round(totals.protein)}g
						</p>
						<p className="text-[10px] text-on-surface-variant">Protein</p>
					</div>
					<div className="bg-secondary/5 rounded-xl p-2.5 text-center">
						<p className="text-sm font-bold text-secondary">
							{Math.round(totals.carbs)}g
						</p>
						<p className="text-[10px] text-on-surface-variant">Carbs</p>
					</div>
					<div className="bg-tertiary/5 rounded-xl p-2.5 text-center">
						<p className="text-sm font-bold text-tertiary">
							{Math.round(totals.fat)}g
						</p>
						<p className="text-[10px] text-on-surface-variant">Fat</p>
					</div>
				</div>
			</div>

			{/* Meals - swipeable content */}
			{initialLoad && loading ? (
				<DiarySkeleton />
			) : (
				<AnimatePresence mode="wait" custom={direction}>
					<motion.div
						key={date}
						ref={dragRef}
						custom={direction}
						variants={slideVariants}
						initial="enter"
						animate="center"
						exit="exit"
						transition={{ duration: 0.2, ease: "easeInOut" }}
						drag="x"
						dragConstraints={{ left: 0, right: 0 }}
						dragElastic={0.15}
						onDragEnd={handleDragEnd}
						className={`space-y-4 touch-pan-y ${loading && !initialLoad ? "opacity-50 pointer-events-none" : ""} transition-opacity duration-150`}
					>
						{entries.length === 0 && !loading ? (
							<FadeIn>
								<div className="text-center py-10 space-y-3">
									<EmptyPlateIllustration className="w-40 h-28 mx-auto text-on-surface-variant" />
									<p className="text-on-surface-variant font-medium">
										No meals logged yet
									</p>
									<p className="text-sm text-outline">
										Snap a photo to get started!
									</p>
									<Link
										href="/log"
										className="inline-flex items-center justify-center px-6 py-2.5 bg-primary text-white rounded-full font-bold text-sm shadow-lg shadow-primary/20 active:scale-95 transition-all"
									>
										Log your first meal
									</Link>
								</div>
							</FadeIn>
						) : (
							MEAL_TYPES.map((type) => {
								const config = MEAL_CONFIG[type];
								const Icon = config.icon;
								const mealCals = grouped[type].reduce((s, e) => s + e.calories, 0);

								return (
									<section
										key={type}
										className="bg-white rounded-2xl border border-surface-container overflow-hidden shadow-sm"
									>
										{/* Meal header */}
										<div className="px-5 py-4 flex items-center justify-between border-b border-surface-container-low">
											<div className="flex items-center gap-3">
												<Icon className={`size-5 ${config.color.split(" ")[0]}`} fill="currentColor" />
												<h4 className="font-bold text-on-surface">{config.label}</h4>
											</div>
											<div className="flex items-center gap-3">
												<span className="text-xs font-semibold text-outline">{Math.round(mealCals)} kcal</span>
												{grouped[type].length > 0 && (
													<Link href="/log" className="w-8 h-8 flex items-center justify-center rounded-full bg-surface-container-low text-primary">
														<Plus className="size-5" />
													</Link>
												)}
											</div>
										</div>

										{/* Entries or empty state */}
										{grouped[type].length === 0 ? (
											<div className="p-8 text-center bg-surface-container-low/20">
												<div className="w-14 h-14 bg-white rounded-full shadow-sm flex items-center justify-center mx-auto mb-4 border border-surface-container">
													<Cookie className="size-5 text-outline" />
												</div>
												<p className="text-sm font-semibold text-on-surface mb-1">Time for a refill?</p>
												<p className="text-xs text-outline mb-5">Log your {config.label.toLowerCase()} to stay on track with your goals.</p>
												<Link
													href="/log"
													className="inline-flex items-center gap-2 bg-primary text-white px-6 py-2 rounded-full font-bold text-xs active:scale-95 transition-all shadow-md shadow-primary/20"
												>
													<Plus className="size-4" />
													QUICK LOG
												</Link>
											</div>
										) : (
											<div className="divide-y divide-surface-container-low">
												{grouped[type].map((entry) => (
													<div
														key={entry.id}
														className="p-4 flex items-center justify-between active:bg-surface-container-low/30 transition-colors cursor-pointer group"
													>
														<div className="flex items-center gap-3 min-w-0">
															{entry.photoUrl && (
																<img
																	src={entry.photoUrl}
																	alt={entry.name}
																	className="w-12 h-12 rounded-xl object-cover shrink-0"
																/>
															)}
															<div className="min-w-0">
																<p className="font-semibold text-sm text-on-surface leading-tight truncate">
																	{entry.name}
																</p>
																<p className="text-xs text-outline mt-0.5">
																	P:{Math.round(entry.proteinG)}g &middot; C:{Math.round(entry.carbsG)}g &middot; F:{Math.round(entry.fatG)}g
																</p>
															</div>
														</div>
														<div className="flex items-center gap-2 shrink-0">
															<span className="font-bold text-on-surface">{Math.round(entry.calories)}</span>
															<button
																type="button"
																onClick={() => handleDelete(entry.id)}
																className="w-7 h-7 rounded-lg flex items-center justify-center text-outline opacity-0 group-hover:opacity-100 hover:bg-destructive/10 hover:text-destructive transition-all"
															>
																<X className="size-3.5" />
															</button>
														</div>
													</div>
												))}
											</div>
										)}
									</section>
								);
							})
						)}
					</motion.div>
				</AnimatePresence>
			)}
		</div>
	);
}

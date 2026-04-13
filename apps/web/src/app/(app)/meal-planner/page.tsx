"use client";

import { FadeIn } from "@/components/motion";
import { Button } from "@/components/ui/button";
import {
	Calendar,
	ChevronLeft,
	ChevronRight,
	Plus,
	Sunrise,
	Sun,
	Moon,
	Cookie,
} from "lucide-react";
import { useState } from "react";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

interface MealSlot {
	id: string;
	type: "breakfast" | "lunch" | "dinner" | "snack";
	name?: string;
	calories?: number;
}

const MEAL_SLOTS: {
	type: "breakfast" | "lunch" | "dinner" | "snack";
	label: string;
	icon: typeof Sunrise;
	color: string;
}[] = [
	{ type: "breakfast", label: "Breakfast", icon: Sunrise, color: "text-tertiary-container bg-tertiary/10" },
	{ type: "lunch", label: "Lunch", icon: Sun, color: "text-secondary bg-secondary/10" },
	{ type: "dinner", label: "Dinner", icon: Moon, color: "text-primary bg-primary/10" },
	{ type: "snack", label: "Snack", icon: Cookie, color: "text-tertiary bg-tertiary/10" },
];

export default function MealPlannerPage() {
	const [selectedDay, setSelectedDay] = useState(0);
	const [weekOffset, setWeekOffset] = useState(0);

	const startOfWeek = new Date();
	startOfWeek.setDate(
		startOfWeek.getDate() - startOfWeek.getDay() + 1 + weekOffset * 7,
	);

	const weekDates = DAYS.map((_, i) => {
		const d = new Date(startOfWeek);
		d.setDate(d.getDate() + i);
		return d;
	});

	const weekLabel = `${weekDates[0].toLocaleDateString("en-US", { month: "short", day: "numeric" })} - ${weekDates[6].toLocaleDateString("en-US", { month: "short", day: "numeric" })}`;

	return (
		<div className="space-y-5">
			<FadeIn>
				<div className="flex items-center justify-between">
					<h1 className="text-2xl font-bold text-foreground">Meal Planner</h1>
					<div className="w-10 h-10 rounded-xl bg-surface-container-low flex items-center justify-center">
						<Calendar className="size-5 text-on-surface-variant" />
					</div>
				</div>
			</FadeIn>

			{/* Week navigation */}
			<FadeIn delay={0.05}>
				<div className="flex items-center justify-between">
					<button
						type="button"
						onClick={() => setWeekOffset((o) => o - 1)}
						className="w-9 h-9 rounded-xl bg-surface-container-low flex items-center justify-center"
					>
						<ChevronLeft className="size-4 text-on-surface-variant" />
					</button>
					<p className="text-sm font-semibold text-foreground">{weekLabel}</p>
					<button
						type="button"
						onClick={() => setWeekOffset((o) => o + 1)}
						className="w-9 h-9 rounded-xl bg-surface-container-low flex items-center justify-center"
					>
						<ChevronRight className="size-4 text-on-surface-variant" />
					</button>
				</div>
			</FadeIn>

			{/* Day selector */}
			<FadeIn delay={0.1}>
				<div className="grid grid-cols-7 gap-1.5">
					{DAYS.map((day, i) => {
						const date = weekDates[i];
						const isSelected = selectedDay === i;
						const isToday =
							date.toDateString() === new Date().toDateString();
						return (
							<button
								key={day}
								type="button"
								onClick={() => setSelectedDay(i)}
								className={`flex flex-col items-center py-2.5 rounded-2xl transition-all ${
									isSelected
										? "bg-gradient-to-br from-primary to-primary-container text-white shadow-md"
										: isToday
											? "bg-primary/10 text-primary"
											: "bg-surface-container-low text-on-surface-variant hover:bg-surface-container"
								}`}
							>
								<span className="text-[10px] font-semibold">{day}</span>
								<span className="text-sm font-bold mt-0.5">
									{date.getDate()}
								</span>
							</button>
						);
					})}
				</div>
			</FadeIn>

			{/* Daily summary */}
			<FadeIn delay={0.15}>
				<div className="bg-card rounded-3xl p-5 shadow-[0_12px_32px_rgba(18,28,42,0.04)] border border-outline-variant/10">
					<div className="flex items-center justify-between mb-1">
						<p className="text-sm font-bold text-foreground">
							{weekDates[selectedDay].toLocaleDateString("en-US", {
								weekday: "long",
								month: "long",
								day: "numeric",
							})}
						</p>
					</div>
					<p className="text-xs text-on-surface-variant">
						No meals planned yet. Tap + to add meals.
					</p>
				</div>
			</FadeIn>

			{/* Meal slots */}
			<div className="space-y-3">
				{MEAL_SLOTS.map((slot, i) => {
					const Icon = slot.icon;
					return (
						<FadeIn key={slot.type} delay={0.2 + i * 0.05}>
							<div className="bg-card rounded-3xl shadow-[0_12px_32px_rgba(18,28,42,0.04)] border border-outline-variant/10 overflow-hidden">
								<div className="flex items-center justify-between px-5 py-4">
									<div className="flex items-center gap-3">
										<div
											className={`w-10 h-10 rounded-xl flex items-center justify-center ${slot.color}`}
										>
											<Icon className="size-5" />
										</div>
										<div>
											<p className="font-semibold text-sm text-foreground">
												{slot.label}
											</p>
											<p className="text-xs text-on-surface-variant">
												No meal added
											</p>
										</div>
									</div>
									<button
										type="button"
										className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center text-primary hover:bg-primary/15 transition-colors"
									>
										<Plus className="size-4" />
									</button>
								</div>
							</div>
						</FadeIn>
					);
				})}
			</div>

			{/* Summary footer */}
			<FadeIn delay={0.4}>
				<div className="bg-gradient-to-br from-primary/5 to-primary-fixed/10 rounded-3xl p-5 text-center">
					<p className="text-xs text-on-surface-variant uppercase tracking-wider font-semibold mb-1">
						Daily Total
					</p>
					<p className="text-3xl font-bold text-foreground">0 kcal</p>
					<div className="grid grid-cols-3 gap-2 mt-3">
						<div className="text-center">
							<p className="text-xs font-bold text-primary">0g</p>
							<p className="text-[10px] text-on-surface-variant">Protein</p>
						</div>
						<div className="text-center">
							<p className="text-xs font-bold text-secondary">0g</p>
							<p className="text-[10px] text-on-surface-variant">Carbs</p>
						</div>
						<div className="text-center">
							<p className="text-xs font-bold text-tertiary">0g</p>
							<p className="text-[10px] text-on-surface-variant">Fat</p>
						</div>
					</div>
				</div>
			</FadeIn>
		</div>
	);
}

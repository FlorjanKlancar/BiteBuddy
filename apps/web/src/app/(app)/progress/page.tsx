"use client";

import { FadeIn } from "@/components/motion";
import { api } from "@/lib/api";
import {
	Award,
	ChevronLeft,
	ChevronRight,
	Flame,
	Target,
	TrendingDown,
	TrendingUp,
	Trophy,
} from "lucide-react";
import { useEffect, useState } from "react";

interface WeeklySummary {
	date: string;
	totalCalories: number;
}

export default function ProgressPage() {
	const [weekly, setWeekly] = useState<WeeklySummary[]>([]);
	const [streak, setStreak] = useState(0);
	const [calorieTarget] = useState(2000);

	useEffect(() => {
		api<WeeklySummary[]>("/api/stats/weekly")
			.then(setWeekly)
			.catch(console.error);
		api<{ streak: number }>("/api/stats/streak")
			.then((s) => setStreak(s.streak))
			.catch(console.error);
	}, []);

	const weeklyAvg =
		weekly.length > 0
			? Math.round(
					weekly.reduce((s, d) => s + d.totalCalories, 0) / weekly.length,
				)
			: 0;

	const daysOnTarget = weekly.filter(
		(d) => d.totalCalories > 0 && d.totalCalories <= calorieTarget * 1.1,
	).length;

	const consistency =
		weekly.length > 0 ? Math.round((daysOnTarget / weekly.length) * 100) : 0;

	return (
		<div className="space-y-5">
			<FadeIn>
				<div className="flex items-center justify-between">
					<h1 className="text-2xl font-bold text-foreground">Progress</h1>
					<div className="w-10 h-10 rounded-xl bg-surface-container-low flex items-center justify-center">
						<Trophy className="size-5 text-on-surface-variant" />
					</div>
				</div>
			</FadeIn>

			{/* Stats cards row */}
			<FadeIn delay={0.1}>
				<div className="grid grid-cols-3 gap-2">
					<div className="bg-card rounded-2xl p-4 text-center shadow-[0_12px_32px_rgba(18,28,42,0.04)] border border-outline-variant/10">
						<div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center mx-auto mb-2">
							<Flame className="size-5 text-secondary" />
						</div>
						<p className="text-xl font-bold text-foreground">{streak}</p>
						<p className="text-[10px] text-on-surface-variant">Day Streak</p>
					</div>
					<div className="bg-card rounded-2xl p-4 text-center shadow-[0_12px_32px_rgba(18,28,42,0.04)] border border-outline-variant/10">
						<div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-2">
							<Target className="size-5 text-primary" />
						</div>
						<p className="text-xl font-bold text-foreground">{consistency}%</p>
						<p className="text-[10px] text-on-surface-variant">On Target</p>
					</div>
					<div className="bg-card rounded-2xl p-4 text-center shadow-[0_12px_32px_rgba(18,28,42,0.04)] border border-outline-variant/10">
						<div className="w-10 h-10 rounded-xl bg-tertiary/10 flex items-center justify-center mx-auto mb-2">
							<Award className="size-5 text-tertiary" />
						</div>
						<p className="text-xl font-bold text-foreground">
							{daysOnTarget}
						</p>
						<p className="text-[10px] text-on-surface-variant">Goals Hit</p>
					</div>
				</div>
			</FadeIn>

			{/* Weekly chart */}
			<FadeIn delay={0.15}>
				<div className="bg-card rounded-3xl p-5 shadow-[0_12px_32px_rgba(18,28,42,0.04)] border border-outline-variant/10">
					<div className="flex items-center justify-between mb-4">
						<div>
							<p className="text-sm font-bold text-foreground">
								Weekly Overview
							</p>
							<p className="text-xs text-on-surface-variant">
								{weeklyAvg.toLocaleString()} kcal/day average
							</p>
						</div>
					</div>

					{/* Bar chart */}
					{weekly.length > 0 ? (
						<div className="flex items-end gap-2 h-36">
							{weekly.map((day) => {
								const height = Math.min(
									100,
									(day.totalCalories / calorieTarget) * 100,
								);
								const isOver = day.totalCalories > calorieTarget;
								const isOnTarget =
									day.totalCalories > 0 &&
									day.totalCalories <= calorieTarget * 1.1;

								return (
									<div
										key={day.date}
										className="flex-1 flex flex-col items-center gap-1.5"
									>
										<span className="text-[9px] font-semibold text-on-surface-variant">
											{day.totalCalories > 0
												? Math.round(day.totalCalories)
												: "—"}
										</span>
										<div
											className={`w-full rounded-xl transition-all duration-700 ease-out ${
												day.totalCalories === 0
													? "bg-surface-container-high"
													: isOver
														? "bg-gradient-to-t from-secondary to-secondary-container"
														: "bg-gradient-to-t from-primary to-primary-container"
											}`}
											style={{
												height: `${Math.max(height, 8)}%`,
											}}
										/>
										<span className="text-[10px] text-on-surface-variant font-medium">
											{new Date(
												day.date + "T12:00:00",
											).toLocaleDateString("en-US", {
												weekday: "narrow",
											})}
										</span>
									</div>
								);
							})}
						</div>
					) : (
						<div className="h-36 flex items-center justify-center">
							<p className="text-sm text-on-surface-variant">
								No data yet. Start tracking!
							</p>
						</div>
					)}

					{/* Legend */}
					<div className="flex items-center justify-center gap-4 mt-4 text-[10px] text-on-surface-variant">
						<span className="flex items-center gap-1">
							<span className="w-2 h-2 rounded-full bg-primary" />
							On Target
						</span>
						<span className="flex items-center gap-1">
							<span className="w-2 h-2 rounded-full bg-secondary" />
							Over Target
						</span>
						<span className="flex items-center gap-1">
							<span className="w-2 h-2 rounded-full bg-surface-container-high" />
							No Data
						</span>
					</div>
				</div>
			</FadeIn>

			{/* Daily history */}
			<FadeIn delay={0.2}>
				<div className="bg-card rounded-3xl p-5 shadow-[0_12px_32px_rgba(18,28,42,0.04)] border border-outline-variant/10">
					<p className="text-sm font-bold text-foreground mb-3">
						Daily History
					</p>
					{weekly.length > 0 ? (
						<div className="space-y-2">
							{[...weekly].reverse().map((day) => {
								const isOver = day.totalCalories > calorieTarget;
								const isOnTarget =
									day.totalCalories > 0 &&
									day.totalCalories <= calorieTarget * 1.1;
								const pct =
									calorieTarget > 0
										? Math.round(
												(day.totalCalories / calorieTarget) * 100,
											)
										: 0;

								return (
									<div
										key={day.date}
										className="flex items-center gap-3 py-2"
									>
										<div
											className={`w-2 h-2 rounded-full shrink-0 ${
												day.totalCalories === 0
													? "bg-surface-container-high"
													: isOver
														? "bg-secondary"
														: "bg-primary"
											}`}
										/>
										<div className="flex-1 min-w-0">
											<p className="text-sm font-medium text-foreground">
												{new Date(
													day.date + "T12:00:00",
												).toLocaleDateString("en-US", {
													weekday: "short",
													month: "short",
													day: "numeric",
												})}
											</p>
										</div>
										<div className="text-right shrink-0">
											<p className="text-sm font-bold text-foreground">
												{day.totalCalories > 0
													? `${Math.round(day.totalCalories)} kcal`
													: "—"}
											</p>
											{day.totalCalories > 0 && (
												<p
													className={`text-[10px] font-semibold ${isOver ? "text-secondary" : "text-primary"}`}
												>
													{pct}% of goal
												</p>
											)}
										</div>
									</div>
								);
							})}
						</div>
					) : (
						<p className="text-sm text-on-surface-variant py-4 text-center">
							No tracking history yet
						</p>
					)}
				</div>
			</FadeIn>
		</div>
	);
}

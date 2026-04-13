"use client";

import { CalorieRing } from "@/components/calorie-ring";
import { MacroChart } from "@/components/macro-chart";
import { FadeIn } from "@/components/motion";
import { api } from "@/lib/api";
import { useSession } from "@/lib/auth-client";
import { TrendingDown, TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";

interface DailySummary {
	totalCalories: number;
	totalProteinG: number;
	totalCarbsG: number;
	totalFatG: number;
	entryCount: number;
}

interface WeeklySummary {
	date: string;
	totalCalories: number;
}

export default function DashboardPage() {
	const { data: session } = useSession();
	const [daily, setDaily] = useState<DailySummary | null>(null);
	const [weekly, setWeekly] = useState<WeeklySummary[]>([]);
	const [calorieTarget] = useState(2000);

	const today = new Date().toISOString().split("T")[0];

	useEffect(() => {
		api<DailySummary>(`/api/stats/daily?date=${today}`)
			.then(setDaily)
			.catch(console.error);
		api<WeeklySummary[]>("/api/stats/weekly")
			.then(setWeekly)
			.catch(console.error);
	}, [today]);

	const consumed = daily?.totalCalories ?? 0;
	const remaining = Math.max(0, calorieTarget - consumed);
	const progress = calorieTarget > 0 ? consumed / calorieTarget : 0;

	function getMotivation() {
		if (!daily || consumed === 0) return null;
		if (consumed > calorieTarget * 1.2)
			return { title: "Over budget", subtitle: "You've exceeded your goal by quite a bit — tomorrow's a fresh start!", emoji: "😅", gradient: "from-red-500 to-red-700" };
		if (consumed > calorieTarget * 1.05)
			return { title: "Slightly over", subtitle: "Just a little above your target — still a solid day!", emoji: "💪", gradient: "from-orange-500 to-orange-700" };
		if (progress >= 0.9)
			return { title: "Perfect Score!", subtitle: "You hit your goals today!", emoji: "🎉", gradient: "from-green-500 to-green-700" };
		if (progress >= 0.7)
			return { title: "Almost there!", subtitle: `Just ${remaining.toLocaleString()} kcal left — you're so close!`, emoji: "🔥", gradient: "from-blue-500 to-blue-700" };
		if (progress >= 0.4)
			return { title: "Good progress", subtitle: `${remaining.toLocaleString()} kcal remaining — keep going!`, emoji: "⚡", gradient: "from-indigo-500 to-indigo-700" };
		return { title: "Just getting started", subtitle: `${remaining.toLocaleString()} kcal left to hit your goal`, emoji: "🍽️", gradient: "from-slate-500 to-slate-700" };
	}

	const motivation = getMotivation();

	const weeklyAvg =
		weekly.length > 0
			? Math.round(weekly.reduce((s, d) => s + d.totalCalories, 0) / weekly.length)
			: 0;

	return (
		<div className="space-y-6">
			{/* Greeting */}
			<FadeIn>
				<div>
					<h1 className="text-2xl font-bold text-on-surface" style={{ letterSpacing: "-0.03em" }}>
						Hey, {session?.user?.name?.split(" ")[0] ?? "there"}
					</h1>
					<p className="text-sm text-on-surface-variant">
						{new Date().toLocaleDateString("en-US", {
							weekday: "long",
							month: "long",
							day: "numeric",
						})}
					</p>
				</div>
			</FadeIn>

			{/* Calorie Ring */}
			<FadeIn delay={0.1}>
				<div className="bg-white rounded-3xl p-6 shadow-[0_12px_32px_rgba(18,28,42,0.04)] border border-outline-variant/10">
					<CalorieRing consumed={consumed} target={calorieTarget} />
				</div>
			</FadeIn>

			{/* Macros */}
			<FadeIn delay={0.15}>
				<MacroChart
					protein={daily?.totalProteinG ?? 0}
					carbs={daily?.totalCarbsG ?? 0}
					fat={daily?.totalFatG ?? 0}
				/>
			</FadeIn>

			{/* Weekly Trend */}
			{weekly.filter((d) => d.totalCalories > 0).length >= 2 && (
				<FadeIn delay={0.2}>
					<div className="bg-surface-container-low rounded-3xl p-6 space-y-6">
						<div className="flex justify-between items-end">
							<div>
								<h3 className="font-bold text-lg text-on-surface">Weekly Trend</h3>
								<p className="text-on-surface-variant text-xs">
									Averaging {weeklyAvg.toLocaleString()} kcal/day
								</p>
							</div>
							<button type="button" className="text-primary text-xs font-semibold hover:opacity-80 transition-opacity">
								View Details
							</button>
						</div>

						<div className="flex items-end justify-between h-32 px-2 gap-2">
							{weekly.map((day, i) => {
								const height = Math.min(100, (day.totalCalories / calorieTarget) * 100);
								const isToday = i === weekly.length - 1;
								return (
									<div key={day.date} className="flex flex-col items-center gap-2 flex-1">
										<div
											className={`w-full rounded-t-lg transition-all duration-700 ${
												isToday ? "bg-primary" : "bg-primary/20"
											}`}
											style={{ height: `${Math.max(height, 5)}%` }}
										/>
										<span className={`text-[10px] font-medium ${isToday ? "font-bold text-primary" : "text-on-surface-variant"}`}>
											{new Date(day.date + "T12:00:00").toLocaleDateString("en-US", { weekday: "narrow" })}
										</span>
									</div>
								);
							})}
						</div>
					</div>
				</FadeIn>
			)}

			{/* Motivation */}
			{motivation && (
				<FadeIn delay={0.3}>
					<div className={`relative overflow-hidden bg-gradient-to-br ${motivation.gradient} rounded-3xl p-6 text-white shadow-lg`}>
						<div className="relative z-10 flex items-center justify-between">
							<div className="space-y-1">
								<h4 className="font-bold text-xl">{motivation.title}</h4>
								<p className="text-white/80 text-sm">{motivation.subtitle}</p>
							</div>
							<div className="bg-white/20 p-3 rounded-2xl backdrop-blur-md text-2xl">
								{motivation.emoji}
							</div>
						</div>
						<div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
					</div>
				</FadeIn>
			)}
		</div>
	);
}

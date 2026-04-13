"use client";

import { FadeIn } from "@/components/motion";
import { api } from "@/lib/api";
import Link from "next/link";
import { useEffect, useState } from "react";

interface WeeklySummary {
	date: string;
	totalCalories: number;
	totalProteinG: number;
	totalCarbsG: number;
	totalFatG: number;
}

export default function HistoryPage() {
	const [weekly, setWeekly] = useState<WeeklySummary[]>([]);
	const [calorieTarget] = useState(2000);

	useEffect(() => {
		api<WeeklySummary[]>("/api/stats/weekly")
			.then(setWeekly)
			.catch(console.error);
	}, []);

	return (
		<div className="space-y-5">
			<FadeIn>
				<h1 className="text-2xl font-bold text-foreground">History</h1>
			</FadeIn>

			{/* Legend */}
			<FadeIn delay={0.05}>
				<div className="flex gap-4 text-xs text-on-surface-variant">
					<span className="flex items-center gap-1.5">
						<span className="w-2.5 h-2.5 rounded-full bg-blue-400" />
						Under
					</span>
					<span className="flex items-center gap-1.5">
						<span className="w-2.5 h-2.5 rounded-full bg-primary" />
						On target
					</span>
					<span className="flex items-center gap-1.5">
						<span className="w-2.5 h-2.5 rounded-full bg-secondary" />
						Over
					</span>
				</div>
			</FadeIn>

			{weekly.length === 0 ? (
				<FadeIn delay={0.1}>
					<div className="text-center py-10">
						<p className="text-on-surface-variant">
							No logged days yet. Start by logging food!
						</p>
					</div>
				</FadeIn>
			) : (
				<div className="space-y-2">
					{weekly.map((day, i) => {
						const isOver = day.totalCalories > calorieTarget * 1.1;
						const isUnder =
							day.totalCalories > 0 &&
							day.totalCalories <= calorieTarget * 0.9;

						return (
							<FadeIn key={day.date} delay={0.1 + i * 0.03}>
								<Link href={`/diary?date=${day.date}`}>
									<div className="bg-card rounded-2xl p-4 shadow-[0_12px_32px_rgba(18,28,42,0.04)] border border-outline-variant/10 flex items-center gap-3 hover:bg-surface-container-low transition-colors">
										<div
											className={`w-3 h-3 rounded-full shrink-0 ${
												day.totalCalories === 0
													? "bg-surface-container-high"
													: isOver
														? "bg-secondary"
														: isUnder
															? "bg-blue-400"
															: "bg-primary"
											}`}
										/>
										<div className="flex-1 min-w-0">
											<p className="text-sm font-semibold text-foreground">
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
												{Math.round(day.totalCalories)} kcal
											</p>
											<p className="text-[10px] text-on-surface-variant">
												P:{Math.round(day.totalProteinG)}g · C:
												{Math.round(day.totalCarbsG)}g · F:
												{Math.round(day.totalFatG)}g
											</p>
										</div>
									</div>
								</Link>
							</FadeIn>
						);
					})}
				</div>
			)}
		</div>
	);
}

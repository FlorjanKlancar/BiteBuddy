"use client";

interface MacroChartProps {
	protein: number;
	carbs: number;
	fat: number;
	proteinTarget?: number;
	carbsTarget?: number;
	fatTarget?: number;
}

export function MacroChart({ protein, carbs, fat, proteinTarget, carbsTarget, fatTarget }: MacroChartProps) {
	const pTarget = proteinTarget ?? 120;
	const cTarget = carbsTarget ?? 250;
	const fTarget = fatTarget ?? 70;

	const macros = [
		{
			label: "Protein",
			value: protein,
			target: pTarget,
			pct: Math.min(Math.round((protein / pTarget) * 100), 100),
			color: "bg-secondary",
			textColor: "text-secondary",
			trackColor: "bg-secondary/10",
		},
		{
			label: "Carbs",
			value: carbs,
			target: cTarget,
			pct: Math.min(Math.round((carbs / cTarget) * 100), 100),
			color: "bg-tertiary",
			textColor: "text-tertiary",
			trackColor: "bg-tertiary/10",
		},
		{
			label: "Fat",
			value: fat,
			target: fTarget,
			pct: Math.min(Math.round((fat / fTarget) * 100), 100),
			color: "bg-error",
			textColor: "text-error",
			trackColor: "bg-error/10",
		},
	];

	return (
		<div className="grid grid-cols-3 gap-4">
			{macros.map((m) => (
				<div
					key={m.label}
					className="bg-surface-container-lowest p-4 rounded-xl shadow-[0_12px_32px_rgba(18,28,42,0.04)] border border-outline-variant/10"
				>
					<div className="flex flex-col gap-3">
						<div className="flex justify-between items-center">
							<span className={`text-[10px] uppercase font-semibold ${m.textColor} tracking-wider`}>
								{m.label}
							</span>
							<span className="font-bold text-sm">
								{Math.round(m.value)}g
							</span>
						</div>
						<div className={`h-1.5 w-full ${m.trackColor} rounded-full overflow-hidden`}>
							<div
								className={`h-full ${m.color} rounded-full transition-all duration-700`}
								style={{ width: `${m.pct}%` }}
							/>
						</div>
					</div>
				</div>
			))}
		</div>
	);
}

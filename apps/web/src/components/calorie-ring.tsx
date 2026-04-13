"use client";

interface CalorieRingProps {
	consumed: number;
	target: number;
}

export function CalorieRing({ consumed, target }: CalorieRingProps) {
	const percentage = Math.min((consumed / target) * 100, 100);
	const remaining = Math.max(target - consumed, 0);
	const r = 110;
	const circumference = 2 * Math.PI * r;
	const offset = circumference - (percentage / 100) * circumference;
	const isOver = consumed > target;

	return (
		<div className="relative flex flex-col items-center justify-center py-6">
			<div className="relative w-64 h-64 flex items-center justify-center">
				<svg className="w-full h-full -rotate-90" viewBox="0 0 256 256">
					<defs>
						<linearGradient id="primaryGradient" x1="0%" y1="0%" x2="100%" y2="100%">
							<stop offset="0%" style={{ stopColor: "#006e2f" }} />
							<stop offset="100%" style={{ stopColor: "#22c55e" }} />
						</linearGradient>
					</defs>
					{/* Background track */}
					<circle
						cx="128"
						cy="128"
						r={r}
						fill="transparent"
						stroke="currentColor"
						className="text-surface-container-low"
						strokeWidth="12"
					/>
					{/* Progress ring */}
					<circle
						cx="128"
						cy="128"
						r={r}
						fill="transparent"
						stroke={isOver ? "#ba1a1a" : "url(#primaryGradient)"}
						strokeWidth="14"
						strokeLinecap="round"
						strokeDasharray={circumference}
						strokeDashoffset={offset}
						className="transition-[stroke-dashoffset] duration-1000 ease-out"
					/>
				</svg>
				{/* Inner content */}
				<div className="absolute inset-0 flex flex-col items-center justify-center text-center">
					<span className="text-on-surface-variant text-[10px] uppercase tracking-[0.2em] mb-1 font-semibold">
						{isOver ? "Over by" : "Calories Left"}
					</span>
					<span className="font-extrabold text-5xl tracking-tight" style={{ letterSpacing: "-0.03em" }}>
						{isOver ? Math.round(consumed - target).toLocaleString() : Math.round(remaining).toLocaleString()}
					</span>
					<span className="text-on-surface-variant text-sm mt-1">
						Goal: {target.toLocaleString()}
					</span>
				</div>
			</div>
		</div>
	);
}

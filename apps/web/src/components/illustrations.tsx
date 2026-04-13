import type { SVGProps } from "react";

const PRIMARY = "currentColor";

export function HealthyFoodIllustration(props: SVGProps<SVGSVGElement>) {
	return (
		<svg viewBox="0 0 200 160" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
			{/* Plate */}
			<ellipse cx="100" cy="120" rx="80" ry="20" className="fill-muted" />
			<ellipse cx="100" cy="116" rx="70" ry="16" className="fill-card" stroke={PRIMARY} strokeWidth="2" />

			{/* Apple */}
			<circle cx="75" cy="85" r="22" className="fill-primary/20" stroke={PRIMARY} strokeWidth="2" />
			<path d="M75 63 C75 55 82 52 82 52" stroke={PRIMARY} strokeWidth="2" strokeLinecap="round" />
			<path d="M78 55 C82 53 86 56 84 60" className="fill-primary/40" />

			{/* Banana */}
			<path d="M110 70 Q140 60 145 85 Q148 100 130 105 Q120 95 115 80 Z" className="fill-yellow-300/60" stroke={PRIMARY} strokeWidth="2" />

			{/* Broccoli */}
			<circle cx="55" cy="95" r="8" className="fill-primary/30" />
			<circle cx="48" cy="100" r="7" className="fill-primary/30" />
			<circle cx="62" cy="100" r="7" className="fill-primary/30" />
			<rect x="53" y="100" width="4" height="12" rx="2" className="fill-primary/50" />

			{/* Carrot */}
			<path d="M135 90 L145 115 L130 115 Z" className="fill-orange-300/60" stroke={PRIMARY} strokeWidth="1.5" />
			<path d="M133 83 C135 78 140 80 138 85" className="fill-primary/40" />

			{/* Steam lines */}
			<path d="M80 55 Q83 45 80 38" stroke={PRIMARY} strokeWidth="1.5" strokeLinecap="round" opacity="0.3" />
			<path d="M90 50 Q93 40 90 33" stroke={PRIMARY} strokeWidth="1.5" strokeLinecap="round" opacity="0.3" />
			<path d="M100 52 Q103 42 100 35" stroke={PRIMARY} strokeWidth="1.5" strokeLinecap="round" opacity="0.3" />
		</svg>
	);
}

export function CameraPhotoIllustration(props: SVGProps<SVGSVGElement>) {
	return (
		<svg viewBox="0 0 200 160" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
			{/* Phone body */}
			<rect x="60" y="20" width="80" height="120" rx="12" className="fill-card" stroke={PRIMARY} strokeWidth="2" />
			<rect x="66" y="32" width="68" height="90" rx="4" className="fill-muted" />

			{/* Camera viewfinder */}
			<circle cx="100" cy="77" r="20" stroke={PRIMARY} strokeWidth="2" strokeDasharray="4 3" className="fill-primary/10" />
			<circle cx="100" cy="77" r="8" className="fill-primary/30" />

			{/* Camera icon on screen */}
			<path d="M94 70 L96 66 L104 66 L106 70 L110 70 L110 84 L90 84 L90 70 Z" stroke={PRIMARY} strokeWidth="1.5" fill="none" />
			<circle cx="100" cy="77" r="4" stroke={PRIMARY} strokeWidth="1.5" />

			{/* Food on screen (small) */}
			<circle cx="80" cy="100" r="6" className="fill-primary/20" />
			<circle cx="95" cy="105" r="5" className="fill-yellow-300/40" />
			<circle cx="110" cy="100" r="7" className="fill-orange-300/40" />

			{/* Sparkles */}
			<path d="M45 50 L48 45 L51 50 L48 55 Z" className="fill-primary/40" />
			<path d="M150 40 L153 35 L156 40 L153 45 Z" className="fill-primary/40" />
			<path d="M155 90 L157 86 L159 90 L157 94 Z" className="fill-primary/30" />
			<circle cx="42" cy="90" r="3" className="fill-primary/20" />
		</svg>
	);
}

export function EmptyPlateIllustration(props: SVGProps<SVGSVGElement>) {
	return (
		<svg viewBox="0 0 200 120" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
			{/* Plate */}
			<ellipse cx="100" cy="80" rx="70" ry="18" className="fill-muted" />
			<ellipse cx="100" cy="76" rx="60" ry="14" className="fill-card" stroke={PRIMARY} strokeWidth="2" />
			<ellipse cx="100" cy="76" rx="40" ry="9" stroke={PRIMARY} strokeWidth="1" opacity="0.2" />

			{/* Fork */}
			<line x1="50" y1="30" x2="50" y2="75" stroke={PRIMARY} strokeWidth="2" strokeLinecap="round" />
			<line x1="44" y1="30" x2="44" y2="50" stroke={PRIMARY} strokeWidth="1.5" strokeLinecap="round" />
			<line x1="50" y1="30" x2="50" y2="50" stroke={PRIMARY} strokeWidth="1.5" strokeLinecap="round" />
			<line x1="56" y1="30" x2="56" y2="50" stroke={PRIMARY} strokeWidth="1.5" strokeLinecap="round" />

			{/* Knife */}
			<line x1="150" y1="30" x2="150" y2="75" stroke={PRIMARY} strokeWidth="2" strokeLinecap="round" />
			<path d="M150 30 Q158 40 155 55 L150 55" stroke={PRIMARY} strokeWidth="1.5" fill="none" />

			{/* Question mark */}
			<text x="100" y="78" textAnchor="middle" className="fill-muted-foreground" fontSize="16" fontWeight="bold">?</text>
		</svg>
	);
}

export function CelebrationIllustration(props: SVGProps<SVGSVGElement>) {
	return (
		<svg viewBox="0 0 200 160" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
			{/* Trophy / star */}
			<path d="M100 30 L108 55 L135 55 L113 70 L121 95 L100 80 L79 95 L87 70 L65 55 L92 55 Z" className="fill-primary/30" stroke={PRIMARY} strokeWidth="2" />

			{/* Confetti pieces */}
			<rect x="40" y="40" width="8" height="4" rx="2" className="fill-primary/50" transform="rotate(-20 44 42)" />
			<rect x="150" y="35" width="8" height="4" rx="2" className="fill-yellow-400/60" transform="rotate(15 154 37)" />
			<rect x="30" y="80" width="6" height="3" rx="1.5" className="fill-orange-400/50" transform="rotate(-10 33 81)" />
			<rect x="160" y="75" width="6" height="3" rx="1.5" className="fill-primary/40" transform="rotate(25 163 76)" />
			<circle cx="55" cy="55" r="3" className="fill-primary/30" />
			<circle cx="145" cy="60" r="3" className="fill-yellow-400/40" />
			<circle cx="50" cy="100" r="2.5" className="fill-primary/40" />
			<circle cx="155" cy="95" r="2.5" className="fill-orange-300/40" />

			{/* Ribbons */}
			<path d="M85 95 Q80 115 70 130" stroke={PRIMARY} strokeWidth="2" strokeLinecap="round" opacity="0.3" />
			<path d="M115 95 Q120 115 130 130" stroke={PRIMARY} strokeWidth="2" strokeLinecap="round" opacity="0.3" />

			{/* Base text */}
			<text x="100" y="150" textAnchor="middle" className="fill-muted-foreground" fontSize="10" fontWeight="600">GOAL REACHED!</text>
		</svg>
	);
}

export function OnboardingBodyIllustration(props: SVGProps<SVGSVGElement>) {
	return (
		<svg viewBox="0 0 120 100" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
			{/* Person silhouette */}
			<circle cx="60" cy="25" r="14" className="fill-primary/20" stroke={PRIMARY} strokeWidth="2" />
			<path d="M40 50 Q40 42 50 40 L70 40 Q80 42 80 50 L80 80 Q80 88 70 90 L50 90 Q40 88 40 80 Z" className="fill-primary/10" stroke={PRIMARY} strokeWidth="2" />

			{/* Measurement lines */}
			<line x1="25" y1="40" x2="25" y2="90" stroke={PRIMARY} strokeWidth="1.5" strokeLinecap="round" opacity="0.4" />
			<line x1="22" y1="40" x2="28" y2="40" stroke={PRIMARY} strokeWidth="1.5" strokeLinecap="round" opacity="0.4" />
			<line x1="22" y1="90" x2="28" y2="90" stroke={PRIMARY} strokeWidth="1.5" strokeLinecap="round" opacity="0.4" />

			{/* Scale */}
			<rect x="85" y="70" width="25" height="18" rx="4" className="fill-primary/10" stroke={PRIMARY} strokeWidth="1.5" />
			<text x="97" y="83" textAnchor="middle" className="fill-primary" fontSize="8" fontWeight="bold">kg</text>
		</svg>
	);
}

export function OnboardingActivityIllustration(props: SVGProps<SVGSVGElement>) {
	return (
		<svg viewBox="0 0 120 100" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
			{/* Running person */}
			<circle cx="55" cy="22" r="10" className="fill-primary/20" stroke={PRIMARY} strokeWidth="2" />
			<path d="M55 32 L55 55" stroke={PRIMARY} strokeWidth="2.5" strokeLinecap="round" />
			<path d="M55 40 L40 50" stroke={PRIMARY} strokeWidth="2.5" strokeLinecap="round" />
			<path d="M55 40 L70 48" stroke={PRIMARY} strokeWidth="2.5" strokeLinecap="round" />
			<path d="M55 55 L42 75" stroke={PRIMARY} strokeWidth="2.5" strokeLinecap="round" />
			<path d="M55 55 L68 72" stroke={PRIMARY} strokeWidth="2.5" strokeLinecap="round" />

			{/* Motion lines */}
			<line x1="78" y1="30" x2="90" y2="30" stroke={PRIMARY} strokeWidth="1.5" strokeLinecap="round" opacity="0.3" />
			<line x1="80" y1="38" x2="95" y2="38" stroke={PRIMARY} strokeWidth="1.5" strokeLinecap="round" opacity="0.3" />
			<line x1="78" y1="46" x2="88" y2="46" stroke={PRIMARY} strokeWidth="1.5" strokeLinecap="round" opacity="0.3" />

			{/* Heart rate */}
			<path d="M85 65 L90 65 L93 55 L97 75 L100 60 L105 65 L110 65" stroke={PRIMARY} strokeWidth="1.5" strokeLinecap="round" className="stroke-primary" opacity="0.5" />
		</svg>
	);
}

export function OnboardingTargetIllustration(props: SVGProps<SVGSVGElement>) {
	return (
		<svg viewBox="0 0 120 100" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
			{/* Target circles */}
			<circle cx="60" cy="50" r="35" stroke={PRIMARY} strokeWidth="2" opacity="0.2" fill="none" />
			<circle cx="60" cy="50" r="25" stroke={PRIMARY} strokeWidth="2" opacity="0.3" fill="none" />
			<circle cx="60" cy="50" r="15" className="fill-primary/10" stroke={PRIMARY} strokeWidth="2" opacity="0.5" />
			<circle cx="60" cy="50" r="5" className="fill-primary/40" />

			{/* Arrow */}
			<line x1="95" y1="20" x2="65" y2="48" stroke={PRIMARY} strokeWidth="2" strokeLinecap="round" />
			<path d="M65 48 L70 42 M65 48 L72 50" stroke={PRIMARY} strokeWidth="2" strokeLinecap="round" />

			{/* Sparkles */}
			<path d="M30 25 L32 20 L34 25 L32 30 Z" className="fill-primary/30" />
			<path d="M90 75 L92 70 L94 75 L92 80 Z" className="fill-primary/30" />
		</svg>
	);
}

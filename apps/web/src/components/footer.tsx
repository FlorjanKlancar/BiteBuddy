import { Zap } from "lucide-react";
import Link from "next/link";

export function Footer() {
	return (
		<footer className="relative z-10 border-t border-outline-variant/30 bg-surface/80 backdrop-blur-sm">
			<div className="mx-auto max-w-2xl lg:max-w-5xl px-6 py-10">
				<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
					{/* Logo + tagline */}
					<div className="flex flex-col gap-1.5">
						<Link href="/" className="flex items-center gap-2">
							<div className="w-6 h-6 bg-gradient-to-br from-primary to-primary-container rounded-md flex items-center justify-center">
								<Zap className="w-3.5 h-3.5 text-white" strokeWidth={2.5} fill="currentColor" />
							</div>
							<span className="font-extrabold text-base tracking-tight text-on-surface">
								Bite<span className="text-primary">Buddy</span>
							</span>
						</Link>
						<p className="text-xs text-on-surface-variant">
							Smart calorie tracking, powered by AI.
						</p>
					</div>

					{/* Links */}
					<div className="flex items-center gap-5 text-sm">
						<Link href="#" className="text-on-surface-variant hover:text-on-surface transition-colors">
							Privacy
						</Link>
						<Link href="#" className="text-on-surface-variant hover:text-on-surface transition-colors">
							Terms
						</Link>
						<Link href="#" className="text-on-surface-variant hover:text-on-surface transition-colors">
							Contact
						</Link>
					</div>
				</div>

				{/* Copyright */}
				<div className="mt-8 pt-5 border-t border-outline-variant/20">
					<p className="text-xs text-on-surface-variant/70">
						&copy; {new Date().getFullYear()} BiteBuddy. All rights reserved.
					</p>
				</div>
			</div>
		</footer>
	);
}

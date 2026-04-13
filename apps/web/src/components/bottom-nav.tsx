"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, BookOpen, Camera, BarChart3, User } from "lucide-react";
import type { LucideIcon } from "lucide-react";

const navItems: { href: string; label: string; icon: LucideIcon; isCenter?: boolean }[] = [
	{ href: "/dashboard", label: "Home", icon: Home },
	{ href: "/diary", label: "Diary", icon: BookOpen },
	{ href: "/log", label: "Scan", icon: Camera, isCenter: true },
	{ href: "/progress", label: "Stats", icon: BarChart3 },
	{ href: "/profile", label: "Profile", icon: User },
];

export function BottomNav() {
	const pathname = usePathname();

	return (
		<nav className="fixed bottom-0 w-full z-50 bg-white/90 backdrop-blur-2xl rounded-t-3xl shadow-[0_-4px_20px_rgba(0,0,0,0.03)] border-t border-outline-variant/30">
			<div className="flex justify-around items-center h-20 px-4 w-full max-w-lg mx-auto">
				{navItems.map((item) => {
					const isActive = pathname === item.href;
					const Icon = item.icon;

					if (item.isCenter) {
						return (
							<div key={item.href} className="relative -top-6">
								<Link href={item.href}>
									<button
										type="button"
										className="bg-gradient-to-br from-green-600 to-green-400 w-14 h-14 rounded-2xl flex items-center justify-center shadow-xl shadow-green-500/20 active:scale-95 transition-transform"
									>
										<Icon className="size-7 text-white" strokeWidth={2.5} />
									</button>
								</Link>
							</div>
						);
					}

					return (
						<Link
							key={item.href}
							href={item.href}
							className={`flex flex-col items-center justify-center group transition-all duration-200 active:scale-90 ${
								isActive
									? "text-green-700"
									: "text-gray-400 hover:text-gray-600"
							}`}
						>
							<div
								className={`flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-200 ${
									isActive
										? "bg-green-100"
										: "group-hover:bg-gray-100"
								}`}
							>
								<Icon
									className="size-[22px] transition-transform group-active:scale-90"
									strokeWidth={isActive ? 2.5 : 1.75}
								/>
							</div>
							<span
								className={`text-[10px] tracking-wide mt-0.5 transition-colors ${
									isActive ? "font-semibold" : "font-medium"
								}`}
							>
								{item.label}
							</span>
						</Link>
					);
				})}
			</div>
		</nav>
	);
}

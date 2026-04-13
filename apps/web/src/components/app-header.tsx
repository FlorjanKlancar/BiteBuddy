"use client";

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { signOut, useSession } from "@/lib/auth-client";
import { BarChart3, BookOpen, Flame, Home, LogOut, User, Zap, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface AppHeaderProps {
	streak?: number;
}

export function AppHeader({ streak = 0 }: AppHeaderProps) {
	const { data: session } = useSession();
	const router = useRouter();
	const [scrolled, setScrolled] = useState(false);

	useEffect(() => {
		const onScroll = () => setScrolled(window.scrollY > 10);
		window.addEventListener("scroll", onScroll, { passive: true });
		return () => window.removeEventListener("scroll", onScroll);
	}, []);

	const initial = session?.user?.name?.charAt(0)?.toUpperCase() ?? "U";

	return (
		<header className="fixed top-0 left-0 right-0 z-50 px-4 pt-3">
			<nav
				className={`mx-auto max-w-2xl lg:max-w-5xl flex items-center justify-between h-14 px-4 rounded-2xl transition-all duration-300 ${
					scrolled
						? "bg-white/90 backdrop-blur-2xl shadow-[0_8px_32px_rgba(0,0,0,0.08)] border border-outline-variant/20"
						: "bg-white/60 backdrop-blur-xl border border-outline-variant/10"
				}`}
			>
				{/* Left: Logo */}
				<Link href="/" className="flex items-center gap-2 shrink-0">
					<div className="w-7 h-7 bg-gradient-to-br from-primary to-primary-container rounded-lg flex items-center justify-center">
						<Zap className="w-4 h-4 text-white" strokeWidth={2.5} fill="currentColor" />
					</div>
					<span className="font-extrabold text-lg tracking-tight text-on-surface">
						Bite<span className="text-primary">Buddy</span>
					</span>
				</Link>

				{/* Right: Auth-dependent */}
				{session ? (
					<div className="flex items-center gap-2">
						{/* Streak */}
						<div className="flex items-center gap-1.5 bg-tertiary-container/10 pl-2.5 pr-3 py-1 rounded-full">
							<Flame className="size-3.5 text-tertiary" fill="currentColor" />
							<span className="font-bold text-xs text-tertiary tabular-nums">{streak}</span>
						</div>
						{/* Avatar dropdown */}
						<DropdownMenu>
							<DropdownMenuTrigger
								className="w-8 h-8 rounded-full overflow-hidden bg-primary/10 flex items-center justify-center shrink-0 ring-2 ring-white cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/40"
							>
								{session.user?.image ? (
									<img className="w-full h-full object-cover" alt="Profile" src={session.user.image} />
								) : (
									<span className="text-xs font-bold text-primary">{initial}</span>
								)}
							</DropdownMenuTrigger>
							<DropdownMenuContent align="end" className="w-48">
								<DropdownMenuItem onClick={() => router.push("/dashboard")}>
									<Home className="mr-2 size-4" />
									Home
								</DropdownMenuItem>
								<DropdownMenuItem onClick={() => router.push("/diary")}>
									<BookOpen className="mr-2 size-4" />
									Diary
								</DropdownMenuItem>
								<DropdownMenuItem onClick={() => router.push("/progress")}>
									<BarChart3 className="mr-2 size-4" />
									Stats
								</DropdownMenuItem>
								<DropdownMenuItem onClick={() => router.push("/profile")}>
									<User className="mr-2 size-4" />
									Profile
								</DropdownMenuItem>
								<DropdownMenuSeparator />
								<DropdownMenuItem
									onClick={async () => {
										await signOut();
										router.push("/login");
									}}
									className="text-destructive focus:text-destructive"
								>
									<LogOut className="mr-2 size-4" />
									Sign Out
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					</div>
				) : (
					<div className="flex items-center gap-2">
						<Link
							href="/login"
							className="text-sm font-semibold text-on-surface-variant hover:text-on-surface transition-colors px-3 py-1.5"
						>
							Log in
						</Link>
						<Link
							href="/register"
							className="flex items-center gap-1 text-sm font-semibold text-white bg-primary hover:bg-primary/90 pl-3.5 pr-3 py-1.5 rounded-full transition-all active:scale-95 shadow-sm shadow-primary/20"
						>
							Get Started
							<ArrowRight className="size-3.5" />
						</Link>
					</div>
				)}
			</nav>
		</header>
	);
}

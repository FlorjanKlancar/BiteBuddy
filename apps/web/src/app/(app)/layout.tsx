"use client";

import { AppHeader } from "@/components/app-header";
import { BottomNav } from "@/components/bottom-nav";
import { AppLayoutSkeleton } from "@/components/skeletons/app-layout-skeleton";
import { api } from "@/lib/api";
import { useSession } from "@/lib/auth-client";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function AppLayout({ children }: { children: React.ReactNode }) {
	const router = useRouter();
	const pathname = usePathname();
	const { data: session, isPending } = useSession();
	const [profileChecked, setProfileChecked] = useState(false);
	const [hasProfile, setHasProfile] = useState(false);
	const [streak, setStreak] = useState(0);

	useEffect(() => {
		if (!session) return;

		setProfileChecked(false);

		api("/api/profile")
			.then((profile) => {
				setHasProfile(profile !== null);
				setProfileChecked(true);
			})
			.catch(() => {
				setHasProfile(false);
				setProfileChecked(true);
			});

		api<{ streak: number }>("/api/stats/streak")
			.then((s) => setStreak(s.streak))
			.catch(() => {});
	}, [session]);

	// Redirect in an effect to avoid setState-during-render
	useEffect(() => {
		if (isPending || !profileChecked) return;
		if (!session) {
			router.push("/login");
		} else if (!hasProfile && pathname !== "/onboarding") {
			router.push("/onboarding");
		}
	}, [session, isPending, profileChecked, hasProfile, pathname, router]);

	const shouldRedirect = !session || (!hasProfile && pathname !== "/onboarding");

	if (isPending || (session && !profileChecked) || shouldRedirect) {
		return <AppLayoutSkeleton />;
	}

	const isOnboarding = pathname === "/onboarding";

	return (
		<div
			className="min-h-screen bg-surface"
			style={{
				backgroundImage: "radial-gradient(circle, rgba(18,28,42,0.12) 1px, transparent 1px)",
				backgroundSize: "24px 24px",
			}}
		>
			{!isOnboarding && <AppHeader streak={streak} />}
			<main className={`mx-auto max-w-lg px-6 pb-28 ${isOnboarding ? "pt-6" : "pt-22"}`}>
				{children}
			</main>
			{!isOnboarding && <BottomNav />}
		</div>
	);
}

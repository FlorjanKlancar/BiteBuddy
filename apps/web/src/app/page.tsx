"use client";

import { AppHeader } from "@/components/app-header";
import { Footer } from "@/components/footer";
import {
	AnimatedCounter,
	FadeIn,
	ScrollFadeIn,
	StaggerChildren,
	TiltCard,
	motion,
	staggerItemVariants,
} from "@/components/motion";
import { LandingSkeleton } from "@/components/skeletons/landing-skeleton";
import { useSession } from "@/lib/auth-client";
import {
	BarChart3,
	Camera,
	Dumbbell,
	Scan,
	Star,
	Target,
	TrendingUp,
	Zap,
} from "lucide-react";
import Link from "next/link";
import { useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

const MotionLink = motion.create(Link);

export default function LandingPage() {
	const { data: session, isPending } = useSession();
	const heroRef = useRef<HTMLDivElement>(null);
	const { scrollY } = useScroll();
	const blob1Y = useTransform(scrollY, [0, 600], [0, -80]);
	const blob2Y = useTransform(scrollY, [0, 600], [0, -120]);
	const blob3Y = useTransform(scrollY, [0, 600], [0, -50]);

	if (isPending) {
		return <LandingSkeleton />;
	}

	return (
		<div className="min-h-screen bg-surface antialiased relative overflow-hidden">
			{/* ── Global background decorations ── */}
			{/* Top gradient wash */}
			<div
				className="absolute top-0 left-0 right-0 h-[900px] pointer-events-none"
				style={{
					background:
						"radial-gradient(ellipse 90% 70% at 50% -5%, rgba(0,110,47,0.22) 0%, transparent 65%)",
				}}
				aria-hidden
			/>
			{/* Dot grid pattern overlay */}
			<div
				className="absolute inset-0 pointer-events-none opacity-[0.12]"
				style={{
					backgroundImage:
						"radial-gradient(circle, #121c2a 1px, transparent 1px)",
					backgroundSize: "24px 24px",
				}}
				aria-hidden
			/>
			{/* Large ambient blobs scattered down the page */}
			<div className="absolute top-[400px] -left-10 w-[700px] h-[700px] rounded-full bg-primary/30 blur-[150px] pointer-events-none" aria-hidden />
			<div className="absolute top-[1000px] -right-10 w-[600px] h-[600px] rounded-full bg-secondary/25 blur-[150px] pointer-events-none" aria-hidden />
			<div className="absolute top-[1700px] left-1/4 w-[550px] h-[550px] rounded-full bg-tertiary/20 blur-[150px] pointer-events-none" aria-hidden />
			<div className="absolute top-[2500px] -right-5 w-[600px] h-[600px] rounded-full bg-primary/20 blur-[150px] pointer-events-none" aria-hidden />

			<AppHeader />

			<main className="relative z-10 max-w-2xl lg:max-w-5xl mx-auto pt-24 pb-32 px-6 space-y-20 lg:space-y-28">
				{/* ── Hero Section ── */}
				<FadeIn>
					<section
						ref={heroRef}
						className="text-center space-y-6 pt-8 relative overflow-visible"
					>
						{/* Floating parallax blobs */}
						<motion.div
							style={{ y: blob1Y }}
							className="absolute -top-12 -left-24 w-48 h-48 rounded-full bg-primary/8 blur-3xl pointer-events-none select-none"
							aria-hidden
						/>
						<motion.div
							style={{ y: blob2Y }}
							className="absolute top-20 -right-20 w-36 h-36 rounded-full bg-secondary/8 blur-3xl pointer-events-none select-none"
							aria-hidden
						/>
						<motion.div
							style={{ y: blob3Y }}
							className="absolute -bottom-8 left-1/4 w-28 h-28 rounded-full bg-tertiary/8 blur-3xl pointer-events-none select-none"
							aria-hidden
						/>

						<div className="relative z-10 space-y-6">
							<div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/15 px-4 py-1.5 rounded-full">
								<Zap className="size-3.5 text-primary" fill="currentColor" />
								<span className="text-primary text-xs font-bold tracking-wider uppercase">
									AI-Powered Nutrition
								</span>
							</div>

							<h1 className="text-[3rem] md:text-[4rem] lg:text-[4.5rem] leading-[1.05] font-extrabold tracking-tight text-on-surface">
								Snap. Track.
								<br />
								<span className="bg-gradient-to-r from-primary to-primary-container bg-clip-text text-transparent">
									Hit Your Goals.
								</span>
							</h1>

							<p className="text-on-surface-variant text-lg md:text-xl leading-relaxed max-w-lg mx-auto">
								The world&apos;s most intuitive macro tracker. Built for
								performance, designed for lifestyle.
							</p>

							<div className="pt-4">
								<MotionLink
									href="/register"
									whileHover={{ scale: 1.03 }}
									whileTap={{ scale: 0.97 }}
									className="relative inline-flex items-center justify-center bg-primary text-white px-8 py-4 rounded-2xl text-lg font-bold shadow-lg shadow-primary/20 overflow-hidden group"
								>
									<span className="relative z-10">Start Your Journey</span>
									<span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_ease-in-out]" />
								</MotionLink>
							</div>

							</div>
					</section>
				</FadeIn>

				{/* ── Bento Grid ── */}
				<ScrollFadeIn>
					<StaggerChildren className="grid grid-cols-2 lg:grid-cols-4 gap-4">
						{/* Large Image Card */}
						<motion.div
							variants={staggerItemVariants}
							className="col-span-2 lg:col-span-2 lg:row-span-2 relative h-64 md:h-80 lg:h-full lg:min-h-[360px] rounded-xl overflow-hidden shadow-[0_12px_32px_rgba(18,28,42,0.06)] group"
						>
							<img
								alt="Healthy bowl"
								className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
								src="https://lh3.googleusercontent.com/aida-public/AB6AXuCTWJYSadFSqfd8fCe1py6sw5zi77JlMqeh697noibW5JSCHkDstM204VN7RWg73YEDgrbQCM-FH3AsEOLW87xGVqL97ZuJMvAaD02HILGs1D9GAHfHj6XM0ggmNsU6QwIyR3EwjXLVp8lgUeTYyBz9bwK7eqFPQzZdm6GS02GZb7ILlm2JiY3dUIBmhm_foM7q8hxgFIZZYT7Afk2XCjLaWE1HStMLRwEkrbecQnIn9D2Z33uBguQnZ27Fs636QfQSNzqiN_jlZ9o"
							/>
							<div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
							<div className="absolute bottom-6 left-6 right-6 flex justify-between items-end">
								<div className="space-y-1">
									<span className="text-white/80 text-[10px] font-bold uppercase tracking-widest">
										Instant Analysis
									</span>
									<p className="text-white text-xl font-bold">
										Snap & Analyze
									</p>
								</div>
								<div className="bg-white/15 backdrop-blur-md p-2.5 rounded-full">
									<Camera className="size-5 text-white" />
								</div>
							</div>
						</motion.div>

						{/* Macro Precision */}
						<motion.div variants={staggerItemVariants}>
							<TiltCard className="bg-white/40 backdrop-blur-xl p-6 rounded-xl h-full flex flex-col justify-between gap-4 border border-white/60 shadow-[0_8px_32px_rgba(0,88,190,0.08)] hover:shadow-[0_8px_32px_rgba(0,88,190,0.16)] transition-shadow">
								<motion.div
									whileHover={{ rotate: 15 }}
									className="bg-secondary text-white w-10 h-10 rounded-full flex items-center justify-center"
								>
									<Dumbbell className="size-5" />
								</motion.div>
								<div>
									<h3 className="text-secondary font-bold text-lg leading-tight">
										Macro Precision
									</h3>
									<p className="text-on-surface-variant text-sm mt-1">
										Target your protein intake with surgical accuracy.
									</p>
								</div>
							</TiltCard>
						</motion.div>

						{/* Goal Oriented */}
						<motion.div variants={staggerItemVariants}>
							<TiltCard className="bg-white/40 backdrop-blur-xl p-6 rounded-xl h-full flex flex-col justify-between gap-4 border border-white/60 shadow-[0_8px_32px_rgba(133,83,0,0.08)] hover:shadow-[0_8px_32px_rgba(133,83,0,0.16)] transition-shadow">
								<motion.div
									whileHover={{ rotate: 15 }}
									className="bg-tertiary text-white w-10 h-10 rounded-full flex items-center justify-center"
								>
									<Zap className="size-5" />
								</motion.div>
								<div>
									<h3 className="text-tertiary font-bold text-lg leading-tight">
										Goal Oriented
									</h3>
									<p className="text-on-surface-variant text-sm mt-1">
										Warm alerts for energy peaks and fuel timings.
									</p>
								</div>
							</TiltCard>
						</motion.div>

						{/* AI Recognition (NEW) */}
						<motion.div variants={staggerItemVariants}>
							<TiltCard className="bg-white/40 backdrop-blur-xl p-6 rounded-xl h-full flex flex-col justify-between gap-4 border border-white/60 shadow-[0_8px_32px_rgba(0,110,47,0.08)] hover:shadow-[0_8px_32px_rgba(0,110,47,0.16)] transition-shadow">
								<motion.div
									whileHover={{ rotate: 15 }}
									className="bg-primary text-white w-10 h-10 rounded-full flex items-center justify-center"
								>
									<Scan className="size-5" />
								</motion.div>
								<div>
									<h3 className="text-primary font-bold text-lg leading-tight">
										AI Recognition
									</h3>
									<p className="text-on-surface-variant text-sm mt-1">
										Identify 10,000+ foods with a single photo.
									</p>
								</div>
							</TiltCard>
						</motion.div>

						{/* Progress Tracking (NEW) */}
						<motion.div variants={staggerItemVariants}>
							<TiltCard className="bg-white/40 backdrop-blur-xl p-6 rounded-xl h-full flex flex-col justify-between gap-4 border border-white/60 shadow-[0_8px_32px_rgba(0,88,190,0.08)] hover:shadow-[0_8px_32px_rgba(0,88,190,0.16)] transition-shadow">
								<motion.div
									whileHover={{ rotate: 15 }}
									className="bg-secondary text-white w-10 h-10 rounded-full flex items-center justify-center"
								>
									<TrendingUp className="size-5" />
								</motion.div>
								<div>
									<h3 className="text-secondary font-bold text-lg leading-tight">
										Progress Tracking
									</h3>
									<p className="text-on-surface-variant text-sm mt-1">
										Visualize your trends with beautiful charts.
									</p>
								</div>
								{/* Mini bar chart */}
								<div className="flex items-end gap-1 h-8">
									{[40, 60, 45, 80, 65, 90, 75].map((h, i) => (
										<motion.div
											key={i}
											className="flex-1 bg-secondary/30 rounded-sm"
											initial={{ height: 0 }}
											whileInView={{ height: `${h}%` }}
											viewport={{ once: true }}
											transition={{ delay: i * 0.05, duration: 0.4, ease: "easeOut" }}
										/>
									))}
								</div>
							</TiltCard>
						</motion.div>
					</StaggerChildren>
				</ScrollFadeIn>

				{/* ── Animated Stats Bar ── */}
				<ScrollFadeIn>
					<section className="bg-white/40 backdrop-blur-xl rounded-2xl p-8 lg:p-10 border border-white/60 shadow-[0_8px_32px_rgba(18,28,42,0.06)]">
						<div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-0 lg:divide-x lg:divide-outline-variant">
							{[
								{ to: 50000, suffix: "+", label: "Active Users" },
								{ to: 2000000, suffix: "+", label: "Meals Tracked", display: "2M+" },
								{ to: 98, suffix: "%", label: "Accuracy Rate" },
								{ to: 49, suffix: "", label: "App Store Rating", display: "4.9" },
							].map((stat) => (
								<div
									key={stat.label}
									className="flex flex-col items-center text-center"
								>
									{stat.display ? (
										<span className="text-3xl lg:text-4xl font-extrabold text-on-surface">
											{stat.display}
										</span>
									) : (
										<AnimatedCounter
											to={stat.to}
											suffix={stat.suffix}
											className="text-3xl lg:text-4xl font-extrabold text-on-surface"
										/>
									)}
									{stat.label === "App Store Rating" && (
										<div className="flex text-amber-500 mt-1">
											{[...Array(5)].map((_, i) => (
												<Star key={i} className="size-3.5" fill="currentColor" />
											))}
										</div>
									)}
									<span className="text-sm text-on-surface-variant mt-1">
										{stat.label}
									</span>
								</div>
							))}
						</div>
					</section>
				</ScrollFadeIn>

				{/* ── The Process (Alternating rows) ── */}
				<section className="space-y-6 relative">
					{/* Section gradient wash */}
					<div
						className="absolute -inset-x-[50vw] -inset-y-20 pointer-events-none -z-10"
						style={{
							background:
								"radial-gradient(ellipse 70% 50% at 50% 50%, rgba(0,110,47,0.15) 0%, transparent 70%)",
						}}
						aria-hidden
					/>
					{/* Glass container */}
					<ScrollFadeIn>
						<div className="bg-white/40 backdrop-blur-xl rounded-2xl border border-white/60 shadow-[0_8px_32px_rgba(0,110,47,0.06)] p-8 lg:p-12 space-y-8">
							<div className="text-center">
								<h2 className="text-2xl lg:text-3xl font-bold text-on-surface">
									How It Works
								</h2>
								<p className="text-on-surface-variant max-w-lg mx-auto mt-2">
									Three simple steps to take control of your nutrition.
								</p>
							</div>

							<div className="space-y-6 lg:space-y-0 lg:divide-x lg:divide-outline-variant/30 lg:grid lg:grid-cols-3">
								{[
									{
										num: "01",
										icon: Camera,
										title: "Snap a Photo",
										desc: "No manual entry. Just point your camera and let our AI handle the ingredient identification.",
										color: "primary",
									},
									{
										num: "02",
										icon: BarChart3,
										title: "Track Macros",
										desc: "Real-time breakdown of fats, proteins, and carbs visualized in editorial-grade charts.",
										color: "secondary",
									},
									{
										num: "03",
										icon: Target,
										title: "Hit Daily Goals",
										desc: "Personalized feedback that helps you adjust your next meal for perfect balance.",
										color: "tertiary",
									},
								].map((step) => (
									<div
										key={step.num}
										className="flex flex-col items-center text-center gap-4 px-6 py-4"
									>
										<div className="relative">
											<div
												className={`w-16 h-16 lg:w-20 lg:h-20 rounded-2xl bg-${step.color}/10 flex items-center justify-center`}
											>
												<step.icon
													className={`size-7 lg:size-9 text-${step.color}`}
												/>
											</div>
											<span
												className={`absolute -top-2 -right-2 w-6 h-6 rounded-full bg-${step.color} text-white text-[10px] font-bold flex items-center justify-center shadow-md`}
											>
												{step.num}
											</span>
										</div>
										<div className="space-y-1.5">
											<h4 className="text-lg font-bold text-on-surface">
												{step.title}
											</h4>
											<p className="text-sm text-on-surface-variant leading-relaxed">
												{step.desc}
											</p>
										</div>
									</div>
								))}
							</div>
						</div>
					</ScrollFadeIn>
				</section>

				{/* ── Social Proof (featured + side cards) ── */}
				<ScrollFadeIn>
					<section className="space-y-6 relative">
						{/* Section gradient wash */}
						<div
							className="absolute -inset-x-[50vw] -inset-y-20 pointer-events-none -z-10"
							style={{
								background:
									"radial-gradient(ellipse 70% 50% at 50% 50%, rgba(0,88,190,0.12) 0%, transparent 70%)",
							}}
							aria-hidden
						/>
						<h2 className="text-2xl lg:text-3xl font-bold text-on-surface text-center">
							Loved by Users
						</h2>

						<div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
							{/* Featured testimonial — large */}
							<div className="lg:col-span-3 bg-gradient-to-br from-primary to-primary/80 rounded-2xl p-8 lg:p-10 text-white relative overflow-hidden">
								<div
									className="absolute inset-0 pointer-events-none"
									style={{
										background:
											"radial-gradient(circle at top right, rgba(255,255,255,0.1) 0%, transparent 60%)",
									}}
									aria-hidden
								/>
								<div className="relative z-10 space-y-5">
									<div className="flex text-amber-300">
										{[...Array(5)].map((_, j) => (
											<Star
												key={j}
												className="size-5"
												fill="currentColor"
											/>
										))}
									</div>
									<blockquote className="text-xl lg:text-2xl font-medium leading-relaxed">
										&ldquo;BiteBuddy completely changed how I look at food.
										It&apos;s not just a tracker; it&apos;s like having a
										high-end nutritionist in my pocket.&rdquo;
									</blockquote>
									<div className="flex items-center gap-3 pt-2">
										<div className="w-11 h-11 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center font-bold text-sm">
											S
										</div>
										<div>
											<p className="font-semibold">Sarah Jenkins</p>
											<p className="text-white/70 text-sm">Athlete</p>
										</div>
									</div>
								</div>
							</div>

							{/* Side testimonials — stacked */}
							<div className="lg:col-span-2 flex flex-col gap-5">
								{[
									{
										name: "Mike Chen",
										role: "Software Engineer",
										initial: "M",
										bg: "bg-secondary",
										quote:
											"Finally an app that doesn't make me manually search through databases. Snap, done, tracked.",
									},
									{
										name: "Dr. Lisa Park",
										role: "Nutritionist",
										initial: "L",
										bg: "bg-tertiary",
										quote:
											"I recommend BiteBuddy to all my clients. The macro accuracy is remarkable.",
									},
								].map((t) => (
									<TiltCard
										key={t.name}
										intensity={5}
										className="flex-1"
									>
										<div className="bg-white/40 backdrop-blur-xl rounded-xl p-5 shadow-[0_8px_32px_rgba(18,28,42,0.06)] border border-white/60 h-full flex flex-col justify-between gap-3">
											<div className="space-y-3">
												<div className="flex text-amber-500">
													{[...Array(5)].map((_, j) => (
														<Star
															key={j}
															className="size-3.5"
															fill="currentColor"
														/>
													))}
												</div>
												<blockquote className="text-sm leading-relaxed text-on-surface-variant">
													&ldquo;{t.quote}&rdquo;
												</blockquote>
											</div>
											<div className="flex items-center gap-3 pt-1">
												<div
													className={`w-8 h-8 rounded-full ${t.bg} text-white flex items-center justify-center font-bold text-xs`}
												>
													{t.initial}
												</div>
												<div>
													<p className="text-sm font-semibold text-on-surface">
														{t.name}
													</p>
													<p className="text-xs text-on-surface-variant">
														{t.role}
													</p>
												</div>
											</div>
										</div>
									</TiltCard>
								))}
							</div>
						</div>
					</section>
				</ScrollFadeIn>

			</main>

			<Footer />
		</div>
	);
}

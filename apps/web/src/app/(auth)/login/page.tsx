"use client";

import { AppHeader } from "@/components/app-header";
import { FadeIn } from "@/components/motion";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signIn, getAuthErrorMessage } from "@/lib/auth-client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
	const router = useRouter();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		setError("");
		setLoading(true);

		try {
			await signIn.email(
				{ email, password },
				{
					onError: (ctx) => {
						setError(getAuthErrorMessage(ctx.error.message));
					},
					onSuccess: () => {
						router.push("/dashboard");
						router.refresh();
					},
				},
			);
		} catch {
			setError("Something went wrong. Please try again.");
		} finally {
			setLoading(false);
		}
	}

	async function handleGoogleSignIn() {
		try {
			await signIn.social({ provider: "google", callbackURL: "/dashboard" });
		} catch {
			setError("Could not connect to Google. Please try again.");
		}
	}

	return (
		<div className="min-h-screen bg-surface relative overflow-hidden">
			{/* Background decorations */}
			<div
				className="absolute top-0 left-0 right-0 h-[900px] pointer-events-none"
				style={{
					background:
						"radial-gradient(ellipse 90% 70% at 50% -5%, rgba(0,110,47,0.22) 0%, transparent 65%)",
				}}
				aria-hidden
			/>
			<div
				className="absolute inset-0 pointer-events-none opacity-[0.12]"
				style={{
					backgroundImage:
						"radial-gradient(circle, #121c2a 1px, transparent 1px)",
					backgroundSize: "24px 24px",
				}}
				aria-hidden
			/>
			<div className="absolute top-[200px] -left-20 w-[500px] h-[500px] rounded-full bg-primary/25 blur-[150px] pointer-events-none" aria-hidden />
			<div className="absolute top-[400px] -right-16 w-[400px] h-[400px] rounded-full bg-secondary/20 blur-[150px] pointer-events-none" aria-hidden />

			<AppHeader />

			<main className="relative z-10 max-w-lg mx-auto px-6 pt-32 pb-16">
				<FadeIn>
					<div className="text-center mb-8">
						<h1 className="text-2xl font-bold text-on-surface" style={{ letterSpacing: "-0.03em" }}>
							Welcome back
						</h1>
						<p className="text-on-surface-variant text-sm mt-1">Sign in to continue tracking</p>
					</div>
				</FadeIn>

				<FadeIn delay={0.1}>
					<div className="bg-white/40 backdrop-blur-xl rounded-3xl p-6 shadow-[0_8px_32px_rgba(18,28,42,0.06)] border border-white/60 space-y-5">
						<form onSubmit={handleSubmit} className="space-y-5">
							{error && (
								<div className="bg-error-container text-error text-sm p-3 rounded-xl font-medium">
									{error}
								</div>
							)}

							<div className="space-y-1.5">
								<Label htmlFor="email" className="text-sm text-on-surface-variant font-medium">
									Email Address
								</Label>
								<Input
									id="email"
									type="email"
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									required
									className="bg-surface-container-low border-0 rounded-xl h-12 focus:ring-2 focus:ring-primary/40 text-on-surface"
									placeholder="you@example.com"
								/>
							</div>

							<div className="space-y-1.5">
								<Label htmlFor="password" className="text-sm text-on-surface-variant font-medium">
									Password
								</Label>
								<Input
									id="password"
									type="password"
									value={password}
									onChange={(e) => setPassword(e.target.value)}
									required
									className="bg-surface-container-low border-0 rounded-xl h-12 focus:ring-2 focus:ring-primary/40 text-on-surface"
									placeholder="Enter your password"
								/>
								<div className="flex justify-end">
									<button type="button" className="text-xs text-primary font-semibold hover:opacity-80">
										Forgot password?
									</button>
								</div>
							</div>

							<button
								type="submit"
								disabled={loading}
								className="w-full bg-primary text-white font-bold py-4 rounded-2xl shadow-xl shadow-primary/20 hover:shadow-primary/30 active:scale-[0.98] transition-all text-base disabled:opacity-50"
							>
								{loading ? "Signing in..." : "Sign In"}
							</button>
						</form>

						<div className="flex items-center gap-3">
							<div className="flex-1 h-px bg-outline-variant/40" />
							<span className="text-on-surface-variant text-xs font-medium">Or continue with</span>
							<div className="flex-1 h-px bg-outline-variant/40" />
						</div>

						<button
							type="button"
							onClick={handleGoogleSignIn}
							className="w-full flex items-center justify-center gap-2 h-12 rounded-2xl border-2 border-outline-variant/50 bg-white hover:border-primary/40 hover:shadow-md hover:shadow-primary/10 transition-all font-semibold text-sm text-on-surface"
						>
							<svg className="size-5" viewBox="0 0 24 24">
								<path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
								<path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
								<path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
								<path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
							</svg>
							Google
						</button>
					</div>
				</FadeIn>

				<FadeIn delay={0.2}>
					<p className="text-center text-sm text-on-surface-variant mt-8">
						Don&apos;t have an account?{" "}
						<Link href="/register" className="text-primary font-semibold hover:underline">
							Sign up
						</Link>
					</p>
					<p className="text-center text-[11px] text-outline mt-4">
						By continuing, you agree to our{" "}
						<span className="text-primary cursor-pointer">Terms</span> and{" "}
						<span className="text-primary cursor-pointer">Privacy Policy</span>
					</p>
				</FadeIn>
			</main>
		</div>
	);
}

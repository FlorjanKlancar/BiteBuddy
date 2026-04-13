"use client";

import { AppHeader } from "@/components/app-header";
import { FadeIn } from "@/components/motion";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signIn, signUp, getAuthErrorMessage } from "@/lib/auth-client";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { Check, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const registerSchema = z
	.object({
		email: z.string().email("Please enter a valid email address"),
		password: z
			.string()
			.min(8, "At least 8 characters")
			.regex(/[A-Z]/, "Uppercase letter")
			.regex(/[a-z]/, "Lowercase letter")
			.regex(/\d/, "Number")
			.regex(/[^A-Za-z0-9]/, "Special character"),
		confirmPassword: z.string(),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Passwords do not match",
		path: ["confirmPassword"],
	});

type RegisterForm = z.infer<typeof registerSchema>;

const PASSWORD_RULES = [
	{ label: "At least 8 characters", test: (p: string) => p.length >= 8 },
	{ label: "Uppercase letter", test: (p: string) => /[A-Z]/.test(p) },
	{ label: "Lowercase letter", test: (p: string) => /[a-z]/.test(p) },
	{ label: "Number", test: (p: string) => /\d/.test(p) },
	{ label: "Special character", test: (p: string) => /[^A-Za-z0-9]/.test(p) },
];

export default function RegisterPage() {
	const router = useRouter();
	const [serverError, setServerError] = useState("");
	const [loading, setLoading] = useState(false);

	const {
		register,
		handleSubmit,
		watch,
		formState: { errors, isSubmitted },
	} = useForm<RegisterForm>({
		resolver: standardSchemaResolver(registerSchema),
		mode: "onSubmit",
	});

	const password = watch("password", "");
	const ruleResults = PASSWORD_RULES.map((r) => ({
		...r,
		pass: r.test(password),
	}));

	async function onSubmit(data: RegisterForm) {
		setServerError("");
		setLoading(true);

		try {
			await signUp.email(
				{ name: data.email.split("@")[0], email: data.email, password: data.password },
				{
					onError: (ctx) => {
						setServerError(getAuthErrorMessage(ctx.error.message));
					},
					onSuccess: () => {
						router.push("/onboarding");
						router.refresh();
					},
				},
			);
		} catch {
			setServerError("Something went wrong. Please try again.");
		} finally {
			setLoading(false);
		}
	}

	async function handleGoogleSignIn() {
		try {
			await signIn.social({ provider: "google", callbackURL: "/onboarding" });
		} catch {
			setServerError("Could not connect to Google. Please try again.");
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
							Create your account
						</h1>
						<p className="text-on-surface-variant text-sm mt-1">Start tracking your nutrition today</p>
					</div>
				</FadeIn>

				<FadeIn delay={0.1}>
					<div className="bg-white/40 backdrop-blur-xl rounded-3xl p-6 shadow-[0_8px_32px_rgba(18,28,42,0.06)] border border-white/60 space-y-5">
						<form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
							{serverError && (
								<div className="bg-error-container text-error text-sm p-3 rounded-xl font-medium">
									{serverError}
								</div>
							)}

							<div className="space-y-1.5">
								<Label htmlFor="email" className="text-sm text-on-surface-variant font-medium">
									Email Address
								</Label>
								<Input
									id="email"
									type="email"
									{...register("email")}
									className="bg-surface-container-low border-0 rounded-xl h-12 focus:ring-2 focus:ring-primary/40 text-on-surface"
									placeholder="you@example.com"
								/>
								{errors.email && (
									<p className="text-xs text-error flex items-center gap-1.5 pt-1">
										<X className="size-3 shrink-0" />
										{errors.email.message}
									</p>
								)}
							</div>

							<div className="space-y-1.5">
								<Label htmlFor="password" className="text-sm text-on-surface-variant font-medium">
									Password
								</Label>
								<Input
									id="password"
									type="password"
									{...register("password")}
									className="bg-surface-container-low border-0 rounded-xl h-12 focus:ring-2 focus:ring-primary/40 text-on-surface"
									placeholder="Create a strong password"
								/>
								{(password.length > 0 || (isSubmitted && errors.password)) && (
									<ul className="grid grid-cols-2 gap-x-3 gap-y-1 pt-1.5">
										{ruleResults.map((r) => (
											<li
												key={r.label}
												className={`flex items-center gap-1.5 text-xs ${r.pass ? "text-primary" : isSubmitted ? "text-error" : "text-on-surface-variant"}`}
											>
												{r.pass ? (
													<Check className="size-3 shrink-0" />
												) : (
													<X className="size-3 shrink-0" />
												)}
												{r.label}
											</li>
										))}
									</ul>
								)}
							</div>

							<div className="space-y-1.5">
								<Label htmlFor="confirmPassword" className="text-sm text-on-surface-variant font-medium">
									Confirm Password
								</Label>
								<Input
									id="confirmPassword"
									type="password"
									{...register("confirmPassword")}
									className="bg-surface-container-low border-0 rounded-xl h-12 focus:ring-2 focus:ring-primary/40 text-on-surface"
									placeholder="Repeat your password"
								/>
								{errors.confirmPassword && (
									<p className="text-xs text-error flex items-center gap-1.5 pt-1">
										<X className="size-3 shrink-0" />
										{errors.confirmPassword.message}
									</p>
								)}
							</div>

							<button
								type="submit"
								disabled={loading}
								className="w-full bg-primary text-white font-bold py-4 rounded-2xl shadow-xl shadow-primary/20 hover:shadow-primary/30 active:scale-[0.98] transition-all text-base disabled:opacity-50"
							>
								{loading ? "Creating account..." : "Get Started Free"}
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
						Already have an account?{" "}
						<Link href="/login" className="text-primary font-semibold hover:underline">
							Sign in
						</Link>
					</p>
				</FadeIn>
			</main>
		</div>
	);
}

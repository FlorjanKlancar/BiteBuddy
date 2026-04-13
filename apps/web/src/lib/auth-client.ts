import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
	baseURL: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001",
});

export const { signIn, signUp, signOut, useSession } = authClient;

const errorMessages: Record<string, string> = {
	INVALID_EMAIL_OR_PASSWORD: "Invalid email or password.",
	INVALID_PASSWORD: "Invalid email or password.",
	INVALID_EMAIL: "Please enter a valid email address.",
	USER_NOT_FOUND: "No account found with this email.",
	USER_ALREADY_EXISTS: "An account with this email already exists.",
	EMAIL_NOT_VERIFIED: "Please verify your email before signing in.",
	TOO_MANY_REQUESTS: "Too many attempts. Please try again later.",
	WEAK_PASSWORD:
		"Password is too weak. Use at least 8 characters with uppercase, lowercase, number, and special character.",
};

export function getAuthErrorMessage(error: string): string {
	const key = error.toUpperCase().replace(/ /g, "_");
	return errorMessages[key] ?? error;
}

import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { PORTS } from "@bitebuddy/shared";
import { db } from "./db/index.js";
import * as schema from "./db/schema.js";

const frontendUrl = process.env.FRONTEND_URL ?? `http://localhost:${PORTS.web}`;

const isProduction = process.env.NODE_ENV === "production";

export const auth = betterAuth({
	baseURL: process.env.BETTER_AUTH_URL,
	database: drizzleAdapter(db, {
		provider: "pg",
		schema,
	}),
	emailAndPassword: {
		enabled: true,
		minPasswordLength: 8,
		maxPasswordLength: 128,
	},
	socialProviders: {
		...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
			? {
					google: {
						clientId: process.env.GOOGLE_CLIENT_ID,
						clientSecret: process.env.GOOGLE_CLIENT_SECRET,
					},
				}
			: {}),
	},
	trustedOrigins: [frontendUrl],
	advanced: {
		useSecureCookies: isProduction,
		defaultCookieAttributes: {
			sameSite: "none",
			secure: isProduction,
		},
	},
});

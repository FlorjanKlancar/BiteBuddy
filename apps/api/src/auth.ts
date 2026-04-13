import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { PORTS } from "@bitebuddy/shared";
import { db } from "./db/index.js";
import * as schema from "./db/schema.js";

const frontendUrl = process.env.FRONTEND_URL ?? `http://localhost:${PORTS.web}`;

export const auth = betterAuth({
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
		google: {
			clientId: process.env.GOOGLE_CLIENT_ID ?? "",
			clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
		},
	},
	trustedOrigins: [frontendUrl],
});

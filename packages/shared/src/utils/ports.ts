/**
 * Centralized port configuration for all services.
 * Override any port via environment variables.
 */
export const PORTS = {
	web: Number(process.env.PORT_WEB ?? 3000),
	api: Number(process.env.PORT_API ?? 3001),
	db: Number(process.env.PORT_DB ?? 5432),
} as const;

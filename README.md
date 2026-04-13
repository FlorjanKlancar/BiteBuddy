# BiteBuddy

AI-powered nutrition tracking app. Snap a photo of your meal and get instant macro breakdowns, or log food manually. Track calories, macros, and weight over time against personalized goals.

## Tech Stack

- **Monorepo**: Turborepo + Bun
- **Frontend** (`apps/web`): Next.js 16, React 19, Tailwind CSS, Shadcn UI, Framer Motion, Recharts
- **Backend** (`apps/api`): Hono, Drizzle ORM, PostgreSQL
- **Auth**: Better Auth (email/password + Google OAuth)
- **AI**: OpenAI GPT-4o-mini via Vercel AI SDK for food photo analysis
- **Logging**: Pino (`packages/logger`)
- **Shared**: Zod schemas and types (`packages/shared`)

## Project Structure

```
apps/
  web/          → Next.js frontend
  api/          → Hono API server
packages/
  shared/       → Shared types, Zod schemas, constants
  logger/       → Pino logging utility
```

## Getting Started

### Prerequisites

- [Bun](https://bun.sh/) (v1.3.5+)
- PostgreSQL (or Docker)

### Setup

```bash
# Install dependencies
bun install

# Start the database
docker compose up -d postgres

# Push database schema
bun run db:push

# Start development servers
bun run dev
```

The web app runs on `http://localhost:3000` and the API on `http://localhost:3001`.

### Environment Variables

Copy `.env.example` to `.env` (if available) or create a `.env` file with:

```
DATABASE_URL=postgresql://bitebuddy:bitebuddy@localhost:5432/bitebuddy
BETTER_AUTH_SECRET=<your-secret>
BETTER_AUTH_URL=http://localhost:3001
OPENAI_API_KEY=<your-openai-key>
GOOGLE_CLIENT_ID=<your-google-client-id>
GOOGLE_CLIENT_SECRET=<your-google-client-secret>
NEXT_PUBLIC_API_URL=http://localhost:3001
FRONTEND_URL=http://localhost:3000
```

## Scripts

| Command | Description |
|---|---|
| `bun run dev` | Start all apps in development mode |
| `bun run build` | Build all apps |
| `bun run lint` | Lint with Biome |
| `bun run lint:fix` | Lint and auto-fix |
| `bun run db:generate` | Generate Drizzle migrations |
| `bun run db:migrate` | Run migrations |
| `bun run db:push` | Push schema to database |

## Docker

Run the full stack with Docker Compose:

```bash
docker compose up
```

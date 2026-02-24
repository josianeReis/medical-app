# Deploy Runbook - Test Environment (Railway + Vercel + Supabase)

## Scope
This runbook deploys:
- `apps/services/auth` on Railway
- `apps/services/management` on Railway
- `apps/web/consumer` on Vercel
- PostgreSQL on Supabase (pooler connection string)

Safety baseline for test environment:
- `DISABLE_OUTBOUND_EMAIL=true` in `auth`
- New DB only (no legacy data import)
- New credentials only

## Stage A - Manual (you)
### A1) Create Supabase project
1. Create a new project.
2. Open `Project Settings > Database > Connection string`.
3. Copy the **pooler** URL (`DB_URL`).

### A2) Create Railway project
1. Create a new Railway project.
2. Set spending guardrails:
- Alert at `USD 10`
- Hard limit at `USD 15`

### A3) Create 2 Railway services (same repo)
Service 1: `auth`
- Root directory: `/`
- Build command: `bun install --frozen-lockfile`
- Start command: `bun run apps/services/auth/src/index.ts`
- Healthcheck: `/health`

Service 2: `management`
- Root directory: `/`
- Build command: `bun install --frozen-lockfile`
- Start command: `bun run apps/services/management/src/index.ts`
- Healthcheck: `/api/health`

### A4) Create Vercel project
1. Import repo.
2. Set root directory to `apps/web/consumer`.

## Stage B - Local command (you)
Run migration against the new Supabase database:

```bash
cd /Users/josianereis/projects/personal/noxis/laudos-mono/packages/data-access
DB_URL="<SUPABASE_POOLER_DB_URL>" bunx drizzle-kit migrate
```

## Stage C - Environment variables
### C1) Railway `auth` variables
- `DB_URL=<SUPABASE_POOLER_DB_URL>`
- `API_PORT=${{PORT}}`
- `BETTER_AUTH_SECRET=<strong-random-secret>`
- `BETTER_AUTH_URL=<AUTH_PUBLIC_URL>`
- `DEFAULT_EMAIL_FROM=no-reply@example.com`
- `RESEND_API_KEY=<key-or-placeholder>`
- `GOOGLE_CLIENT_ID=<placeholder-if-not-using-social-login>`
- `GOOGLE_CLIENT_SECRET=<placeholder-if-not-using-social-login>`
- `TRUSTED_CALLBACK_URLS=<VERCEL_PUBLIC_URL>`
- `NEXT_PUBLIC_APP_URL=<VERCEL_PUBLIC_URL>`
- `ENABLE_CROSS_SUB_DOMAIN_COOKIES=false`
- `DISABLE_OUTBOUND_EMAIL=true`

### C2) Railway `management` variables
- `DB_URL=<SUPABASE_POOLER_DB_URL>`
- `API_PORT=${{PORT}}`
- `AUTH_SERVICE_URL=<AUTH_PUBLIC_URL>`
- `OPENAI_API_KEY=<key-or-placeholder>`

### C3) Vercel `consumer` variables
- `API_URL=<AUTH_PUBLIC_URL>/api`
- `AUTH_SERVICE_URL=<AUTH_PUBLIC_URL>`
- `MANAGAMENT_API_URL=<MANAGEMENT_PUBLIC_URL>`
- `NEXT_PUBLIC_APP_URL=<VERCEL_PUBLIC_URL>`

## Stage D - Validation
1. `GET <AUTH_PUBLIC_URL>/health` returns 200.
2. `GET <MANAGEMENT_PUBLIC_URL>/api/health` returns 200.
3. Frontend loads and can reach both backends.
4. Auth flows do **not** send outbound email while `DISABLE_OUTBOUND_EMAIL=true`.

## Data you must send back after manual stages
- `DB_URL` (masked is fine, keep host/user visible)
- `AUTH_PUBLIC_URL`
- `MANAGEMENT_PUBLIC_URL`
- `VERCEL_PUBLIC_URL`
- Migration result (success/error)
- Healthcheck results for auth/management

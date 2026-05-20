# Free deployment (Vercel + Neon)

Step-by-step guide for testing Darse Quran Academy on a free stack.

## Stack

| Service | Role | Cost |
|---------|------|------|
| [Vercel](https://vercel.com) | Host Next.js app | Hobby (free) |
| [Neon](https://neon.tech) | PostgreSQL database | Free tier |
| Gmail SMTP (optional) | Certificate / Fatwa emails | Free with limits |

SQLite is **not** used in production (serverless hosts have no persistent disk).

---

## 1. Create Neon database

1. Sign up at [console.neon.tech](https://console.neon.tech).
2. **New Project** → pick a region close to your users.
3. Open **Connection details**.
4. Copy the connection string. For Prisma migrations on Vercel, prefer the **direct** (non-pooler) URL, or the main URL if Neon shows only one.
5. Ensure it includes SSL, e.g. `?sslmode=require`.

Example:

```text
postgresql://user:password@ep-xxx.region.aws.neon.tech/neondb?sslmode=require
```

---

## 2. Deploy on Vercel

1. Push code to GitHub (`master` branch).
2. [vercel.com](https://vercel.com) → **Add New** → **Project** → import `darse-quran-academy`.
3. Framework: **Next.js** (auto). Build uses `npm run vercel-build` from [`vercel.json`](../vercel.json).
4. **Environment variables** (Production; copy to Preview if needed):

| Variable | Example |
|----------|---------|
| `DATABASE_URL` | Neon connection string |
| `AUTH_SECRET` | Output of `openssl rand -base64 32` |
| `AUTH_URL` | `https://your-project.vercel.app` |
| `NEXTAUTH_URL` | Same as `AUTH_URL` |
| `ADMIN_EMAIL` | Your admin login email |
| `SMTP_HOST`, `SMTP_USER`, `SMTP_PASS`, … | Optional |

5. **Deploy**. The build runs `prisma migrate deploy` then `next build` (see [`package.json`](../package.json)).

---

## 3. Seed production data (one time)

After the first successful deploy, seed courses/teachers/library from your machine:

```bash
DATABASE_URL="your-neon-connection-string" npm run db:seed
```

Do **not** add seed to the Vercel build command (it would reset data on every deploy).

---

## 4. Create admin user

1. Open `https://your-project.vercel.app/register`.
2. Register with the **same email** as `ADMIN_EMAIL`.
3. Visit `/admin` → **Payment details** and enter UPI / bank information.

---

## 5. Google OAuth (optional)

1. [Google Cloud Console](https://console.cloud.google.com/apis/credentials) → OAuth client (Web).
2. **Authorized redirect URI:** `https://your-project.vercel.app/api/auth/callback/google`
3. Set `AUTH_GOOGLE_ID` and `AUTH_GOOGLE_SECRET` on Vercel → redeploy.

---

## 6. Verify

- [ ] Homepage and `/courses`
- [ ] Register / login
- [ ] UPI enroll → pay → submit UTR → Admin → **Enrollments** → confirm
- [ ] Mark complete → certificate on **My Courses**
- [ ] Fatwa ask → admin answer → public `/fatwa`
- [ ] Re-enroll shows “already enrolled” message

---

## Local development (SQLite)

Default local setup uses a file database — no Docker required:

```bash
cp .env.example .env
# DATABASE_URL="file:./dev.db"
npm run db:migrate
npm run db:seed
npm run dev
```

Optional: use [docker-compose.yml](../docker-compose.yml) if you prefer local PostgreSQL for testing against production-like DB.

---

## Troubleshooting

| Issue | Fix |
|-------|-----|
| Build fails on `migrate deploy` | Set `DATABASE_URL` on Vercel; use Neon direct URL if pooler errors |
| “UPI not configured” | Admin → **Payment details** — save a UPI ID |
| Admin 403 | `ADMIN_EMAIL` must match signed-in email exactly |
| Emails not sent | Set SMTP vars, or check Vercel **Functions** logs for logged links |
| OAuth redirect error | `AUTH_URL` must match live domain; update Google redirect URI |

---

## Other free hosts

| Host | Notes |
|------|--------|
| **Railway** | SQLite on a volume possible; see README |
| **Render** | Use Render Postgres + same `DATABASE_URL` |
| **Fly.io** | Container + volume or Fly Postgres |

For all hosts: set the same env vars and run `prisma migrate deploy` before or during build.

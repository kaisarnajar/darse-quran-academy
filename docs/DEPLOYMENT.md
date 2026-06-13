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
| `ADMIN_EMAIL` | Comma-separated admin login emails |
| `SMTP_HOST`, `SMTP_USER`, `SMTP_PASS`, … | Optional |

5. **Deploy**. The build runs `prisma migrate deploy` then `next build` (see [`package.json`](../package.json)).

---

## 3. Create admin user and site settings

Production starts with an empty database (schema only). Add real courses, teachers, library items, and other content in **Admin** after sign-in. Do **not** run `npm run db:seed:demo` against production — it is for local QA only.

---

Set `ADMIN_EMAIL` on Vercel **before** creating the admin account (comma- or semicolon-separated list). The signed-in email must match one of those addresses to access `/admin`. Admin role is granted on **sign-in**, not stored at registration.

### Option A — Email and password (recommended)

1. Ensure `ADMIN_EMAIL` includes your admin address (e.g. `you@example.com`).
2. Redeploy or restart if you just changed `ADMIN_EMAIL`.
3. Open `https://your-project.vercel.app/register`.
4. Register with that same email and a password (at least 8 characters).
5. Sign in (or you may be signed in automatically after register).
6. Visit `/admin`.

### Option B — Google sign-in (if OAuth is configured)

1. Ensure `ADMIN_EMAIL` includes the Google account email.
2. Open `/login` and sign in with Google. Auth.js creates the user on first sign-in.
3. Visit `/admin`.

### After first admin login

Configure in `/admin`:

- **Payment details** — UPI ID, payee name, bank account (required before students can pay monthly fees).
- **Social links** — contact email, WhatsApp number, Facebook / Instagram / YouTube URLs (shown on footer `/#contact`, About Us, top bar, and floating WhatsApp button).

**Note:** Admins can open **Profile** in the header, but `/admin` does not require a completed student profile. Profile completion is only needed if you want to test student enrollment yourself.

---

## 4. Google OAuth (optional)

1. [Google Cloud Console](https://console.cloud.google.com/apis/credentials) → OAuth client (Web).
2. **Authorized redirect URI:** `https://your-project.vercel.app/api/auth/callback/google`
3. Set `AUTH_GOOGLE_ID` and `AUTH_GOOGLE_SECRET` on Vercel → redeploy.

---

## 5. Verify

- [ ] Homepage (hero with Bismillah, featured courses) and `/courses`
- [ ] Footer **Contact** (`/#contact`) and **About Us** show admin-configured email and WhatsApp
- [ ] Top bar social icons and floating WhatsApp button use admin URLs
- [ ] Admin register/login with an `ADMIN_EMAIL` address → `/admin` opens
- [ ] Student register / login; forgot-password email (or link in function logs if SMTP off)
- [ ] Student completes profile → **Request enrollment** on a **free** course (enrollment fee ₹0) → Admin → **Enrollments** approves
- [ ] Student **Request enrollment** on a **paid** course → pays enrollment fee (UTR) → Admin → **Payment approvals** confirms → student becomes active
- [ ] Student pays **monthly fee** from **My Courses** → submits UTR → Admin → **Payment approvals**
- [ ] Mark complete → certificate on **My Courses**
- [ ] Admin **course announcements**; teacher **private message** to one student
- [ ] Fatwa ask → admin answer → public `/fatwa`
- [ ] Re-enroll shows “already enrolled” or “awaiting approval” message

---

## Local development (SQLite)

Default local setup uses a file database — no Docker required:

```bash
cp .env.example .env
# Edit .env — set ADMIN_EMAIL to your test admin address(es)
# DATABASE_URL="file:./dev.db"
npm run db:migrate
npm run db:seed:demo
npm run dev
```

`db:seed:demo` is **local QA only** (blocked on production PostgreSQL). It creates courses, teachers, students, announcements, blogs, verse/hadith, fatwa, and login accounts. Do not run it against your live Neon database.

### Demo login accounts (local)

After seeding, sign in at `http://localhost:3000/login`:

| Role | Email | Password |
|------|-------|----------|
| **Admin** | Any address in `ADMIN_EMAIL` in `.env` | `Admin@2026` |
| **Teacher** | `ibrahim.khan@teachers.darsequranacademy.org` … `bilal.wani@teachers.darsequranacademy.org` | `Teacher@2026` |
| **Student** | `demo-student-01@seed.local` … `demo-student-50@seed.local` | `Demo@2026` |

Optional: use [docker-compose.yml](../docker-compose.yml) if you prefer local PostgreSQL for testing against production-like DB (set `ALLOW_DEMO_SEED=true` to run demo seed against it).

---

## Troubleshooting

| Issue | Fix |
|-------|-----|
| Build fails on `migrate deploy` | Set `DATABASE_URL` on Vercel; use Neon direct URL if pooler errors |
| New migration `20260714120000_enrollment_fee_payment` | Run `npx prisma migrate deploy` on production after deploy (enrollment fee + `paymentType` column) |
| “UPI not configured” | Admin → **Payment details** — save a UPI ID |
| Wrong contact email / social links | Admin → **Social links** — save and refresh homepage |
| Cannot access `/admin` | Signed-in email must be listed in `ADMIN_EMAIL` (comma-separated); redeploy after changing env |
| “This email is reserved for administration” on register | Deploy latest `master` — admin emails are allowed to register for bootstrap; use sign-in if the account already exists |
| Admin account does not exist yet | **Production:** register at `/register` with an `ADMIN_EMAIL` address, or sign in with Google. **Local:** set `ADMIN_EMAIL` in `.env` and run `npm run db:seed:demo` (password `Admin@2026`) |
| Schema errors after deploy | Ensure build ran `prisma migrate deploy`; redeploy latest `master` |
| `migrate deploy` fails after migration squash | Reset the database (Neon: delete/recreate project or branch) so only the single `init` migration applies; back up real data first |
| Local `db:migrate` conflicts after pull | Delete `prisma/dev.db`, then run `npm run db:migrate` and `npm run db:seed:demo` |
| Emails not sent | Set SMTP vars, or check Vercel **Functions** logs for logged links |
| OAuth redirect error | `AUTH_URL` must match live domain; update Google redirect URI |
| Uploaded payment screenshots / PDFs missing after redeploy | Expected on serverless without external storage — see README limitations |

---

## Other free hosts

| Host | Notes |
|------|--------|
| **Railway** | SQLite on a volume possible; see README |
| **Render** | Use Render Postgres + same `DATABASE_URL` |
| **Fly.io** | Container + volume or Fly Postgres |

For all hosts: set the same env vars and run `prisma migrate deploy` before or during build.

---

## Related docs

- **[README.md](../README.md)** — features, local setup, environment variables
- **[QA-TESTING-GUIDE.md](QA-TESTING-GUIDE.md)** — manual test checklist (student / teacher / admin, mobile / pad / PC)

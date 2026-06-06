# Darse Quran Academy

Online Islamic learning platform built with **Next.js 16**, **React 19**, **Prisma** (SQLite locally, PostgreSQL on Vercel), and **Auth.js**.

Students browse courses, enroll, pay monthly fees via UPI, and download certificates. Admins manage content, approvals, and payments. Teachers manage assigned courses and submit blog posts for approval.

## Quick start

**Prerequisites:** Node.js 20+ and npm.

```bash
git clone https://github.com/kaisarnajar/darse-quran-academy.git
cd darse-quran-academy
npm install
cp .env.example .env   # edit values — see table below
npm run db:migrate
npm run db:seed
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

`db:seed` loads starter data from `content/` (courses, teachers, library, testimonials). UPI, bank, and social links are configured in **Admin** after first login.

### Admin access

1. Register or sign in with an email listed in `ADMIN_EMAIL` in `.env`.
2. Open [http://localhost:3000/admin](http://localhost:3000/admin).

## Environment variables

| Variable | Required | Description |
|----------|----------|-------------|
| `AUTH_URL` | Yes | Public site URL (OAuth callbacks, email links). |
| `NEXTAUTH_URL` | Yes | Same as `AUTH_URL` in most setups. |
| `AUTH_SECRET` | Yes | Session secret. Generate: `openssl rand -base64 32` |
| `DATABASE_URL` | Yes | Local: `"file:./dev.db"`. Production: PostgreSQL URL. |
| `ADMIN_EMAIL` | Yes | Comma-separated admin emails for `/admin`. |
| `AUTH_GOOGLE_ID` | No | Google OAuth client ID. |
| `AUTH_GOOGLE_SECRET` | No | Google OAuth client secret. |
| `SMTP_HOST` | No | SMTP host (e.g. `smtp.gmail.com`). |
| `SMTP_PORT` | No | SMTP port (default `587`). |
| `SMTP_USER` | No | SMTP login. |
| `SMTP_PASS` | No | SMTP password or app password. |
| `EMAIL_FROM` | No | From header; falls back to `SMTP_USER`. |

If SMTP is not set, transactional emails are logged to the server console for local testing. See `.env.example` for a full local template.

**Never commit `.env` or real secrets.**

## npm scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Prisma generate + development server |
| `npm run build` | Production build |
| `npm run start` | Run production server |
| `npm run lint` | ESLint |
| `npm run db:migrate` | Apply Prisma migrations |
| `npm run db:seed` | Seed courses, teachers, library, testimonials |
| `npm run vercel-build` | Vercel build (`migrate deploy` + `next build`) |

## Project structure

```
app/          Next.js App Router (public, profile, admin, teacher, API)
components/   UI components
content/      Seed data and static copy
lib/          Auth, Prisma, email, payments, certificates
prisma/       Schema, migrations, seed
public/       Static assets and uploads/
docs/         Deployment and QA guides
```

## Deployment

**Recommended:** [Vercel](https://vercel.com) + [Neon](https://neon.tech) (PostgreSQL).

1. Set env vars on Vercel (`AUTH_URL`, `AUTH_SECRET`, `ADMIN_EMAIL`, etc.).
2. Deploy — `vercel-build` runs `prisma migrate deploy` automatically.
3. Seed production once: `DATABASE_URL="..." npm run db:seed`
4. Sign in as admin and set **Payment details** and **Social links**.

Full setup, OAuth, SMTP, and troubleshooting: **[docs/DEPLOYMENT.md](docs/DEPLOYMENT.md)**  
QA checklist: **[docs/QA-TESTING-GUIDE.md](docs/QA-TESTING-GUIDE.md)**

## License

Private project — see repository owner for usage terms.

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
npm run db:seed:demo
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

`db:seed:demo` loads local QA data only: courses, teachers, library, testimonials, logins, enrollments, payments, announcements, blogs, verse/hadith, fatwa, and course announcements (all major states for testing). Blocked on production PostgreSQL. Production starts empty — add real content in `/admin`.

### Demo login accounts

After `npm run db:seed:demo`, use these accounts for local QA (passwords are shared per role):

| Role | Email | Password |
|------|-------|----------|
| **Admin** | Any address listed in `ADMIN_EMAIL` in `.env` | `Admin@2026` |
| **Teacher** | `ibrahim.khan@teachers.darsequranacademy.org` … `hamza.malik@teachers.darsequranacademy.org` (all six seeded teachers) | `Teacher@2026` |
| **Student** | `demo-student-01@seed.local` … `demo-student-25@seed.local` | `Demo@2026` |

1. Add your email(s) to `ADMIN_EMAIL` in `.env` before seeding so admin accounts are created.
2. Sign in at [http://localhost:3000/login](http://localhost:3000/login).
3. Admins → [http://localhost:3000/admin](http://localhost:3000/admin); teachers → `/teacher`; students → `/profile`.

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
| `npm run db:seed:demo` | Local QA data: full test dataset including announcements, blogs, fatwa (SQLite only) |
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
3. Sign in as admin and add courses, teachers, library items, **Payment details**, and **Social links** in `/admin`.

Full setup, OAuth, SMTP, and troubleshooting: **[docs/DEPLOYMENT.md](docs/DEPLOYMENT.md)**  
QA checklist: **[docs/QA-TESTING-GUIDE.md](docs/QA-TESTING-GUIDE.md)**

## License

Private project — see repository owner for usage terms.

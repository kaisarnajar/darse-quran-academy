# Darse Quran Academy

Online Islamic learning platform built with **Next.js 16**, **React 19**, **Prisma** (SQLite locally, PostgreSQL on Vercel), and **Auth.js**.

Students browse courses, enroll, pay enrollment and monthly fees via UPI, download receipts and completion certificates, submit reviews, and ask fatwa questions. Admins manage content, approvals, enrollments, and payments. Teachers manage assigned courses, post announcements, and submit blogs for approval.

## Features

### Public site

- **Home** — featured courses, verse/hadith of the day, announcements, blogs, library picks, fatwa highlights, and student testimonials
- **Courses** — browse, filter, and request enrollment
- **Announcements**, **Blog**, **Teachers**, **Resources** (digital library), **Fatwa** (browse and ask), **Contact**, **About**

### Student profile (`/profile`)

- Profile details (name, occupation, WhatsApp, address, etc.)
- **My Courses** — enrollment status, course announcements, UPI payment for enrollment and monthly fees, certificate download when uploaded
- **Payments** — payment history and receipt download
- **My reviews** — submit multiple reviews (pending admin approval)

### Teacher portal (`/teacher`)

- Dashboard of assigned courses
- Per-course **students** roster and **announcements** (class-wide or private to one student)
- **My blogs** — draft, submit for approval, edit, and view status

### Admin panel (`/admin`)

- **Announcements** — site-wide notices and homepage events
- **Blogs** — admin-authored posts with images
- **Verse & Hadith** — daily inspiration for the homepage
- **Courses** — CRUD, status (draft/published/ongoing/completed/on hold), fees, featured homepage, students, certificates
- **Enrollments** — approve or decline enrollment requests
- **Payment details** — UPI and bank account info shown to students
- **Social links** — contact email, WhatsApp, Facebook, Instagram, YouTube
- **Students** — roster, enrollments, manual payment records
- **Teachers** — profiles and course assignments
- **Digital Library** — PDF resources
- **Fatwa** — answer and feature questions on the homepage
- **Contact inquiries** — read and reply
- **Blog approvals**, **Review approvals**, **Payment approvals** — approve UPI submissions, send or upload receipts

Auth: email/password (register, forgot/reset password), optional Google OAuth.

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

`db:seed:demo` loads local QA data only: courses, teachers, library, testimonials, logins, enrollments, payments (including a sample uploaded receipt), announcements, blogs, verse/hadith, fatwa, course announcements, and a demo completion certificate. Blocked when `NODE_ENV=production` or on PostgreSQL unless `ALLOW_DEMO_SEED=true`. Production starts empty — add real content in `/admin`.

`npm run db:seed:demo` is also registered as the Prisma seed (`npx prisma db seed`).

### Demo login accounts

After `npm run db:seed:demo`, use these accounts for local QA (passwords are shared per role):

| Role | Email | Password |
|------|-------|----------|
| **Admin** | Any address listed in `ADMIN_EMAIL` in `.env` | `Admin@2026` |
| **Teacher** | `ibrahim.khan@teachers.darsequranacademy.org` … `bilal.wani@teachers.darsequranacademy.org` (all 12 seeded teachers) | `Teacher@2026` |
| **Student** | `demo-student-01@seed.local` … `demo-student-50@seed.local` | `Demo@2026` |

1. Add your email(s) to `ADMIN_EMAIL` in `.env` before seeding so admin accounts are created.
2. Sign in at [http://localhost:3000/login](http://localhost:3000/login).
3. Admins → [http://localhost:3000/admin](http://localhost:3000/admin); teachers → `/teacher`; students → `/profile`.

**Demo highlights:** student `06` has an uploaded enrollment receipt; student `19` has a completed `qiraat-advanced` enrollment with an uploaded certificate.

## Environment variables

| Variable | Required | Description |
|----------|----------|-------------|
| `AUTH_URL` | Yes | Public site URL (NextAuth, OAuth callbacks, email links). |
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
| `ALLOW_DEMO_SEED` | No | Set to `true` to run `db:seed:demo` on production PostgreSQL (staging only). |

UPI, bank details, contact email, and social links are configured in **Admin → Payment details** and **Social links** (not in `.env`).

If SMTP is not set, transactional emails are logged to the server console for local testing. See `.env.example` for a full local template.

**Never commit `.env` or real secrets.**

## npm scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Prisma generate + development server |
| `npm run build` | Production build |
| `npm run start` | Run production server |
| `npm run lint` | ESLint |
| `npm run knip` | Dead code and unused dependency check |
| `npm run db:migrate` | Apply Prisma migrations (`migrate dev`) |
| `npm run db:push` | Push schema to DB without migrations (prototyping) |
| `npm run db:seed:demo` | Local QA dataset (SQLite; see seed guards above) |
| `npm run vercel-build` | Vercel build (`migrate deploy` + `next build`) |
| `npm run generate:countries` | Regenerate country list for profile forms |
| `npm run optimize-logo` | Optimize logo assets |

## Project structure

```
app/          Next.js App Router — public pages, profile, admin, teacher, API routes
components/   UI (site, home, admin, teacher, profile, auth)
content/      Seed data and static copy (courses, teachers, demo students)
lib/          Auth, Prisma, email, payments, receipts, certificates, validations
prisma/       Schema, migrations, demo seed scripts
public/       Static assets; uploads/ for certificates, receipts, blogs, payments
scripts/      Build and maintenance scripts
```

## Deployment

**Recommended:** [Vercel](https://vercel.com) + [Neon](https://neon.tech) (PostgreSQL).

1. Set env vars on Vercel (`AUTH_URL`, `AUTH_SECRET`, `ADMIN_EMAIL`, `DATABASE_URL`, optional SMTP and Google OAuth).
2. Deploy — `vercel-build` runs `prisma migrate deploy` automatically.
3. Sign in as admin and add courses, teachers, library items, **Payment details**, and **Social links** in `/admin`.

Uploaded files (certificates, receipts, blog images, payment screenshots) live under `public/uploads/` on the server. For production, ensure persistent storage or accept that uploads are local to the deployment instance unless you add external storage.

## License

Private project — see repository owner for usage terms.

# Darse Quran Academy

Online Islamic learning platform built with **Next.js 16**, **React 19**, **Prisma** (SQLite locally, PostgreSQL on Vercel), and **Auth.js**. Students browse courses, complete a registration profile, request enrollment, pay **monthly fees via UPI**, and download **certificates** when courses are complete. Admins manage content, approve submissions, verify payments, and answer **Fatwa** questions. Teachers manage their courses and submit blog posts for approval.

## Features

### Public site
- **Homepage** — featured courses, academy announcements (up to four), verse/hadith of the day, student testimonials, Fatwa section
- **Courses**, **teachers**, **digital library**, **blog** (approved posts), **announcements**, and **Fatwa Q&A** (answered questions with category filters)
- **Fatwa categories** — Islam, Quran, Hadith, Fiqh, Tajweed, Seerah, Arabic Language, Atheism, Fatwa, Other

### Students
- Accounts via email/password and optional Google sign-in
- **My Profile** (`/profile`) — registration details required before enrolling (name, father's name, date of birth, occupation, address, WhatsApp, email)
- **Enrollment** — per-course enrollment and monthly fees set by admin; free enrollment requests when the enrollment fee is ₹0
- **My Courses** (`/profile/courses`) — course access, monthly fee payment (UPI/bank), course announcements, certificate download when complete
- **Payments** (`/profile/payments`) — payment history and **download receipt** for approved monthly payments
- **Reviews** (`/profile/reviews`) — submit testimonials for admin approval (may appear on the homepage)
- Resubmit payment if an admin **declines** a monthly fee submission

### Teachers (`/teacher`)
- Portal login linked by email
- Manage assigned courses, post **course announcements** (with optional attachments)
- Submit **blog posts** for admin approval before they appear on the public blog

### Admins (`/admin`)
- **Dashboard** — counts and quick links
- **Content** — announcements (optional homepage feature), blogs, verse & hadith of the day, courses (per-course enrollment + monthly fees), teachers, library, Fatwa answers
- **Students & enrollments** — student profiles, enrollment requests, payment verification on course rosters
- **Approvals** (sidebar, after Fatwa) — **blog approvals**, **review approvals**, **payment approvals**
- **Courses → Students** — approve enrollments, confirm/decline payments, mark **complete**, **generate/upload certificate** and email students
- **Payment approvals** — approve monthly fees, then **generate/upload receipt** and email students

## Prerequisites

- [Node.js](https://nodejs.org/) 20+ (22 recommended)
- npm

## Quick start

```bash
git clone https://github.com/kaisarnajar/darse-quran-academy.git
cd darse-quran-academy
npm install
```

### 1. Environment variables

Copy the example file and edit **`.env`** (the app does **not** read `.env.example` at runtime):

```bash
cp .env.example .env
```

Fill in the values described in [Environment variables](#environment-variables) below.

### 2. Database

Local development uses SQLite (`file:./dev.db`).

```bash
npm run db:migrate
npm run db:seed
```

This creates `prisma/dev.db`, applies migrations, and seeds courses, teachers, and library items.

For production (Vercel), use PostgreSQL — see [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md).

### 3. Run locally

```bash
npm run dev
```

(`dev` runs `prisma generate` first.) Open [http://localhost:3000](http://localhost:3000).

### 4. Admin access

1. Register or sign in with an account whose **email matches `ADMIN_EMAIL`** in `.env`.
2. Open [http://localhost:3000/admin](http://localhost:3000/admin).

### 5. Student flow (local test)

1. Sign up and complete **My Profile**.
2. Request enrollment on a course (admin approves if required).
3. Pay monthly fees from **My Courses** → submit UPI reference and screenshot.
4. Admin approves payment under **Payment approvals**, then sends a receipt.
5. Admin marks the course **complete**, then **generates or uploads** a certificate.
6. Student downloads the certificate from **My Courses** or the email link.

## Environment variables

| Variable | Required | Description |
|----------|----------|-------------|
| `AUTH_URL` | Yes | Public site URL (e.g. `http://localhost:3000` or production domain). Used for OAuth callbacks and links in emails. |
| `NEXTAUTH_URL` | Yes | Same as `AUTH_URL` in most setups. |
| `AUTH_SECRET` | Yes | Random secret for session encryption. Generate: `openssl rand -base64 32` |
| `DATABASE_URL` | Yes | Local: `"file:./dev.db"`. Production (Vercel): [Neon](https://neon.tech) PostgreSQL URL with `?sslmode=require` |
| `ADMIN_EMAIL` | Yes | Email address that receives admin access to `/admin`. Must match the signed-in user. |
| `AUTH_GOOGLE_ID` | No | Google OAuth client ID. Leave empty to hide “Sign in with Google”. |
| `AUTH_GOOGLE_SECRET` | No | Google OAuth client secret. |
| `SMTP_HOST` | No | SMTP server host (e.g. `smtp.gmail.com`). |
| `SMTP_PORT` | No | SMTP port (default `587`; use `465` for implicit TLS). |
| `SMTP_USER` | No | SMTP login / sender email. |
| `SMTP_PASS` | No | SMTP password or [Gmail app password](https://myaccount.google.com/apppasswords). |
| `EMAIL_FROM` | No | From header (e.g. `"Darse Quran Academy <you@gmail.com>"`). Falls back to `SMTP_USER`. |

### Email behavior

When `SMTP_HOST`, `SMTP_USER`, and `SMTP_PASS` are set, the app sends:

- **Certificate emails** when an admin sends a certificate (generate or upload)
- **Payment receipt emails** when an admin sends a receipt (generate or upload)
- **Fatwa answer emails** when an admin publishes an answer
- **Payment declined emails** when an admin declines a monthly payment

If SMTP is not configured, emails are **logged to the server console** (including download links) so you can still test locally.

### Password reset

Students and teachers who sign in with email and password can use **Forgot password?** on the sign-in page. Reset links are sent by email when SMTP is configured; otherwise the link is logged to the server console in development.

### Google OAuth (optional)

1. Create credentials at [Google Cloud Console](https://console.cloud.google.com/apis/credentials) (OAuth 2.0 Client ID, Web application).
2. Authorized redirect URI: `{AUTH_URL}/api/auth/callback/google`
3. Set `AUTH_GOOGLE_ID` and `AUTH_GOOGLE_SECRET` in `.env`.

### UPI and monthly payments

1. Admin → **Payment details** — set UPI ID, payee name, and bank account fields.
2. Until UPI ID is saved, payment pages show “UPI payments are not configured.”

**Typical flow:**

1. Student completes profile → enrolls (admin may approve free requests).
2. Student pays a monthly fee from **My Courses** → submits UTR and optional screenshot.
3. Admin → **Payment approvals** → **Approve** (records payment only).
4. Admin → **Generate receipt** or **Upload receipt** (emails download link).
5. Student downloads the receipt from **Profile → Payments**.

Declined payments can be resubmitted from the course pay page.

### Certificates

When an admin marks a student **complete**, they can **generate** a PDF certificate or **upload** a custom PDF, then email the student a download link.

- API: `/api/certificate/[enrollmentId]`
- Student download: **My Courses** (completed courses)

**Runtime assets** (in repo):

- `public/logo.png` — seal in the footer
- `public/icon-512.png` — emblem in the header
- `public/certificate/signature.png` — founder signature

Optional: place `public/certificate/reference-sample.png` and run `npm run build:certificate-assets` to regenerate decorative PNGs (`scripts/build-certificate-assets.mjs`).

Uploaded certificates are stored under `public/uploads/certificates/` (gitignored).

### Payment receipts

Approved monthly payments can use a generated PDF receipt or an admin-uploaded PDF.

- API: `/api/receipt/[paymentRecordId]`
- Student download: **Profile → Payments**

Uploaded receipts are stored under `public/uploads/receipts/` (gitignored).

### Example `.env` (local development)

```env
AUTH_URL=http://localhost:3000
NEXTAUTH_URL=http://localhost:3000
AUTH_SECRET=replace-with-openssl-rand-output
DATABASE_URL="file:./dev.db"
ADMIN_EMAIL=you@example.com

SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=you@gmail.com
SMTP_PASS=your-16-char-app-password
EMAIL_FROM="Darse Quran Academy <you@gmail.com>"
```

**Never commit `.env` or real secrets.** Only `.env.example` with placeholders belongs in git.

## npm scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | `prisma generate` then start development server |
| `npm run build` | Generate Prisma client and production build |
| `npm run start` | Run production server (after `build`) |
| `npm run lint` | Run ESLint |
| `npm run db:migrate` | Apply Prisma migrations (`prisma migrate dev`) |
| `npm run db:push` | Push schema without migration (prototyping) |
| `npm run db:seed` | Seed courses, teachers, library |
| `npm run vercel-build` | Production build on Vercel (`migrate deploy` + `next build`) |
| `npm run optimize-logo` | Compress `public/logo.png` and regenerate favicons |
| `npm run build:certificate-assets` | Extract decorative PNGs from `public/certificate/reference-sample.png` |

## Project structure (high level)

```
app/              # Next.js App Router (public, profile, admin, teacher, API routes)
components/       # UI (site, admin, auth, payment, fatwa, profile, home)
content/          # Static seed data (courses, teachers, library)
lib/              # Auth, Prisma, email, UPI, certificates, receipts, validations
prisma/           # Schema, migrations, seed
public/           # Static assets, uploads/ (payments, certificates, receipts)
scripts/          # Logo optimization, certificate asset builder
docs/             # Deployment guide
```

## Deployment (free testing)

**Recommended:** [Vercel](https://vercel.com) (app) + [Neon](https://neon.tech) (PostgreSQL).

1. Create a Neon project and copy `DATABASE_URL`.
2. Import this repo on Vercel and set environment variables (`AUTH_URL`, `AUTH_SECRET`, `ADMIN_EMAIL`, SMTP, etc.).
3. Deploy — build runs `prisma migrate deploy` automatically ([`vercel.json`](vercel.json)).
4. Seed once from your PC: `DATABASE_URL="..." npm run db:seed`
5. Register with `ADMIN_EMAIL`, open `/admin`, and set **Payment details** (UPI / bank).

Ensure certificate assets (`public/logo.png`, `public/icon-512.png`, `public/certificate/signature.png`) are present in the deployment. User uploads (payments, certificates, receipts) persist on the server filesystem — on serverless hosts, prefer object storage or accept ephemeral uploads unless you add external storage.

Full checklist, OAuth, SMTP, and troubleshooting: **[docs/DEPLOYMENT.md](docs/DEPLOYMENT.md)**

| Platform | SQLite | PostgreSQL |
|----------|--------|------------|
| Vercel | Not supported | Yes (Neon) |
| Railway / Fly.io | Possible with volume | Yes |
| Render free | Unreliable | Yes (Render Postgres) |

## License

Private project — see repository owner for usage terms.

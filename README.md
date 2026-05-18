# Darse Quran Academy

Online Islamic learning platform built with **Next.js 16**, **React 19**, **Prisma** (SQLite locally, PostgreSQL on Vercel), and **Auth.js**. Students browse courses, complete a registration profile, pay via **UPI**, and receive **PDF certificates** on completion. Admins manage content, verify or decline payments, answer **Fatwa** questions, and mark students complete.

## Features

### Public site
- Courses, teachers, digital library, and Fatwa Q&A (answered questions only)

### Students
- Accounts via email/password and optional Google sign-in
- **My Profile** (`/profile`): full registration details (name, father's name, date of birth, occupation, address, WhatsApp, email) — required before enrolling in a course
- **UPI checkout**: QR code, UTR submission, status tracking on **My Courses** (`/profile/courses`)
- Resubmit payment if an admin **declines** a submitted payment
- **Certificate of Appreciation** PDF download when a course is marked complete (email link when SMTP is configured)

### Admins (`/admin`)
- Courses (with status), teachers, library, enrollments, and Fatwa answers
- **Confirm** or **decline** payments awaiting verification
- Mark students complete and send certificate emails
- View extended student profile fields on the student detail page

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

Open [http://localhost:3000](http://localhost:3000).

### 4. Admin access

1. Register or sign in with an account whose **email matches `ADMIN_EMAIL`** in `.env`.
2. Open [http://localhost:3000/admin](http://localhost:3000/admin).

### 5. Student flow (local test)

1. Sign up (name + email only).
2. Open **My Profile** and complete all registration fields.
3. Enroll in a course, pay via UPI (or use admin **Mark as paid**), and wait for payment confirmation.
4. After an admin marks the course **complete**, download the certificate from **My Courses** or the email link.

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
| `UPI_ID` | Yes* | Your UPI VPA (e.g. `name@paytm`, `name@okicici`). Required for course payments. |
| `UPI_PAYEE_NAME` | No | Display name on UPI QR (default: `Darse Quran Academy`). |
| `SMTP_HOST` | No | SMTP server host (e.g. `smtp.gmail.com`). |
| `SMTP_PORT` | No | SMTP port (default `587`; use `465` for implicit TLS). |
| `SMTP_USER` | No | SMTP login / sender email. |
| `SMTP_PASS` | No | SMTP password or [Gmail app password](https://myaccount.google.com/apppasswords). |
| `EMAIL_FROM` | No | From header (e.g. `"Darse Quran Academy <you@gmail.com>"`). Falls back to `SMTP_USER`. |

\*Without `UPI_ID`, checkout shows “UPI payments are not configured.”

### Email behavior

When `SMTP_HOST`, `SMTP_USER`, and `SMTP_PASS` are set, the app sends:

- **Certificate emails** when an admin marks a course complete
- **Fatwa answer emails** when an admin publishes an answer
- **Payment declined emails** when an admin declines a submitted payment

If SMTP is not configured, emails are **logged to the server console** (including download links) so you can still test locally.

### Google OAuth (optional)

1. Create credentials at [Google Cloud Console](https://console.cloud.google.com/apis/credentials) (OAuth 2.0 Client ID, Web application).
2. Authorized redirect URI: `{AUTH_URL}/api/auth/callback/google`
3. Set `AUTH_GOOGLE_ID` and `AUTH_GOOGLE_SECRET` in `.env`.

### UPI and payment verification

1. Set `UPI_ID` to your business/personal UPI ID.
2. Set `UPI_PAYEE_NAME` to the name shown in payment apps.
3. Restart the dev server after changing `.env`.

**Payment flow:**

1. Student completes profile → enrolls → pays via UPI → submits UTR.
2. Status becomes **Awaiting payment verification**.
3. Admin → **Enrollments** → **Confirm payment** or **Decline payment**.
4. If declined, the student can resubmit from **My Courses**.

### Certificates

Completed enrollments expose a PDF at `/api/certificate/[enrollmentId]` (landscape **Certificate of Appreciation** layout).

**Runtime assets** (committed in the repo):

- `public/logo.png` — seal in the footer
- `public/icon-512.png` — emblem in the header
- `public/certificate/signature.png` — founder signature ink

Optional: place `public/certificate/reference-sample.png` and run `npm run build:certificate-assets` to regenerate decorative PNGs from the reference design (see `scripts/build-certificate-assets.mjs`). Do not composite crops that include text from the reference — that causes ghost overlap on generated PDFs.

### Example `.env` (local development)

```env
AUTH_URL=http://localhost:3000
NEXTAUTH_URL=http://localhost:3000
AUTH_SECRET=replace-with-openssl-rand-output
DATABASE_URL="file:./dev.db"
ADMIN_EMAIL=you@example.com

UPI_ID=yourname@okicici
UPI_PAYEE_NAME=Darse Quran Academy

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
| `npm run dev` | Start development server |
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
app/              # Next.js App Router pages & API routes
components/       # UI (site, admin, auth, payment, fatwa, profile)
content/          # Static seed data (courses, teachers, library)
lib/              # Auth, Prisma, email, UPI, certificates, profile, validations
prisma/           # Schema, migrations, seed
public/           # Static assets (logo, icons, certificate/)
scripts/          # Logo optimization, certificate asset builder
docs/             # Deployment guide
```

## Deployment (free testing)

**Recommended:** [Vercel](https://vercel.com) (app) + [Neon](https://neon.tech) (PostgreSQL).

1. Create a Neon project and copy `DATABASE_URL`.
2. Import this repo on Vercel and set environment variables (`AUTH_URL`, `AUTH_SECRET`, `ADMIN_EMAIL`, `UPI_ID`, SMTP, etc.).
3. Deploy — build runs `prisma migrate deploy` automatically ([`vercel.json`](vercel.json)).
4. Seed once from your PC: `DATABASE_URL="..." npm run db:seed`
5. Register with `ADMIN_EMAIL` and open `/admin`.

Ensure certificate assets (`public/logo.png`, `public/icon-512.png`, `public/certificate/signature.png`) are present in the deployment.

Full checklist, OAuth, SMTP, and troubleshooting: **[docs/DEPLOYMENT.md](docs/DEPLOYMENT.md)**

| Platform | SQLite | PostgreSQL |
|----------|--------|------------|
| Vercel | Not supported | Yes (Neon) |
| Railway / Fly.io | Possible with volume | Yes |
| Render free | Unreliable | Yes (Render Postgres) |

## License

Private project — see repository owner for usage terms.

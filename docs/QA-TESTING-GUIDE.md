# Darse Quran Academy — QA Testing Guide

**Purpose:** Manual testing checklist for QA before release.  
**Application URL (local):** `http://localhost:3000` (or your staging/production URL)  
**Last updated:** June 2026

---

## 1. How to use this document

1. Test each area on **three device sizes** (see section 2).
2. For each row, verify **Expected behavior** matches what you see.
3. Mark result: **Pass** / **Fail** / **Blocked** / **N/A**.
4. Note bugs with: page URL, device size, steps, screenshot, and expected vs actual.

### Test accounts (prepare before testing)

**Local QA:** set `ADMIN_EMAIL` in `.env`, then run `npm run db:seed:demo`. Shared passwords:

| Role | Email | Password |
|------|-------|----------|
| **Admin** | Any address in `ADMIN_EMAIL` | `Admin@2026` |
| **Teacher** | `ibrahim.khan@teachers.darsequranacademy.org` … `bilal.wani@teachers.darsequranacademy.org` | `Teacher@2026` |
| **Student** | `demo-student-01@seed.local` … `demo-student-50@seed.local` | `Demo@2026` |

| Role | How to get access (manual / production) | Notes |
|------|----------------------------------------|--------|
| **Student (manual)** | Register at `/register` with an email **not** in `ADMIN_EMAIL` | Complete profile before requesting enrollment |
| **Teacher (manual)** | Register with a normal email, then admin adds that email under **Admin → Teachers** | Sign in → opens teacher portal; cannot access `/profile` |
| **Admin (manual)** | Register at `/register` with an `ADMIN_EMAIL` address (or sign in with Google using that email) | Role granted on sign-in via `ADMIN_EMAIL` |

Optional: Google sign-in if `AUTH_GOOGLE_ID` / `AUTH_GOOGLE_SECRET` are configured (creates the account on first sign-in for admin or student emails).

**After `npm run db:seed:demo`**, the database also includes sample **site announcements** (homepage + public + draft), **blog posts** (published, pending, rejected, etc.), **Quranic verse / Hadith** entries, **fatwa** questions (pending and answered), and **course announcements** (admin, teacher, and private student messages). See the seed console output for a summary.

---

## 2. Device sizes to test

Use browser DevTools (responsive mode) or real devices. Test **portrait and landscape** on mobile/tablet where possible.

| Device category | Typical viewport width | Examples | What to check |
|-----------------|------------------------|----------|----------------|
| **Mobile (small)** | 320px – 639px | Phone | Hamburger menu, stacked layouts, tap targets (buttons easy to press), no horizontal scroll |
| **Pad (medium)** | 640px – 1023px | Tablet | Nav may show more links; cards in 2 columns; sidebars usable |
| **PC (large)** | 1024px and above | Laptop / desktop | Full header nav, admin/teacher sidebars beside content, tables readable |

### Responsive checklist (all pages)

| Check | Mobile | Pad | PC | Expected |
|-------|:------:|:---:|:----:|----------|
| Header logo and navigation usable | ☐ | ☐ | ☐ | Logo visible; menu opens on mobile; all main links reachable |
| Footer readable, links work | ☐ | ☐ | ☐ | Contact block (`#contact`): admin email, WhatsApp, social chips; quick links |
| Text not cut off / overlapping | ☐ | ☐ | ☐ | No clipped headings or buttons |
| Forms usable (inputs, submit) | ☐ | ☐ | ☐ | Fields full width on mobile; keyboard does not hide submit |
| Images / cards scale correctly | ☐ | ☐ | ☐ | No broken layout on course/blog cards |
| Modals / dialogs (e.g. sign out) | ☐ | ☐ | ☐ | Centered, Cancel and confirm buttons visible |

---

## 3. Authentication (all roles)

| Feature | URL | Expected behavior | Mobile | Pad | PC |
|---------|-----|-------------------|:------:|:---:|:----:|
| Sign in | `/login` | Email/password works; optional Google button if enabled; invalid credentials show error | ☐ | ☐ | ☐ |
| Register | `/register` | New account with email/password; admin emails in `ADMIN_EMAIL` **can** register (bootstrap); duplicate email shows error | ☐ | ☐ | ☐ |
| Admin bootstrap (demo) | `/login` + `/admin` | After `db:seed:demo`, sign in with `ADMIN_EMAIL` address and `Admin@2026` → `/admin` loads | ☐ | ☐ | ☐ |
| Admin bootstrap (manual) | `/register` + `/admin` | Register with `ADMIN_EMAIL` address → sign in → `/admin` loads | ☐ | ☐ | ☐ |
| Forgot password | `/forgot-password` | Submit email → success message; reset email if SMTP configured (or link in server logs locally) | ☐ | ☐ | ☐ |
| Reset password | `/reset-password?token=…` | Set new password (min 8 chars); redirect to login with success message | ☐ | ☐ | ☐ |
| Sign out | Any signed-in page | Click **Sign Out** → dialog **“Do you want to sign out?”** → **Cancel** stays signed in; **Sign out** logs out and goes home | ☐ | ☐ | ☐ |
| Admin route guard | `/admin` | Non-admin users cannot access admin pages | ☐ | ☐ | ☐ |
| Teacher route guard | `/teacher` | Only linked teachers see portal; others redirected | ☐ | ☐ | ☐ |

---

## 4. Student profile (`/profile`)

**Access:** Sign in as student or admin → **Profile** in header (not available to teachers; teachers use teacher portal). Admins can open Profile but do **not** need a complete profile for `/admin`.

| Section | URL | Expected behavior | Mobile | Pad | PC |
|---------|-----|-------------------|:------:|:---:|:----:|
| **Profile** | `/profile` | Edit name, father’s name, date of birth, occupation, address, WhatsApp; email shown; warning if profile incomplete; all fields required before **requesting enrollment** | ☐ | ☐ | ☐ |
| **My Courses** | `/profile/courses` | Lists enrollments with status (active, awaiting approval, awaiting enrollment fee, completed); pay enrollment or monthly fee; course announcements; certificate when complete | ☐ | ☐ | ☐ |
| **Payments** | `/profile/payments` | History of approved payments; pending submissions; **Download receipt** when admin sent/generated receipt | ☐ | ☐ | ☐ |
| **Payment info** | `/profile/payment-info` | Shows academy UPI QR and bank details (from admin **Payment details**) | ☐ | ☐ | ☐ |
| **My reviews** | `/profile/reviews` | Submit testimonial (name, location, text); pending/approved/rejected status; edit/resubmit if rejected; delete own review | ☐ | ☐ | ☐ |

### Student flows (end-to-end)

| Flow | Steps | Expected result | Mobile | Pad | PC |
|------|-------|-----------------|:------:|:---:|:----:|
| Request enrollment (free course) | Complete profile → `/courses` → course with **₹0** enrollment fee → **Request enrollment** | `pending_approval`; admin approves under **Enrollments** | ☐ | ☐ | ☐ |
| Request enrollment (paid course) | Course with enrollment fee > ₹0 → **Request enrollment** → **Pay enrollment fee** (UTR) | `awaiting_enrollment_fee` then payment pending; admin confirms under **Payment approvals** → student **active** | ☐ | ☐ | ☐ |
| Pay monthly fee | **My Courses** → **Pay monthly fee** (active enrollment) → UPI/bank → submit UTR + optional screenshot | Submission pending; appears under Payments | ☐ | ☐ | ☐ |
| After payment approved | Admin approves → admin sends receipt | Student can download invoice-style PDF from Payments | ☐ | ☐ | ☐ |
| Declined payment | Admin declines monthly or enrollment fee payment | Student sees message; can resubmit from the pay page | ☐ | ☐ | ☐ |
| Certificate | Admin marks complete + sends certificate | **Download certificate** on My Courses works | ☐ | ☐ | ☐ |
| Course announcements | `/profile/courses/[courseId]/announcements` | **For you** (private teacher messages) and **Course-wide** sections; admin and teacher posts visible as appropriate | ☐ | ☐ | ☐ |

---

## 5. Teacher portal (`/teacher`)

**Access (demo):** Sign in as a seeded teacher (e.g. `hamza.malik@teachers.darsequranacademy.org`, password `Teacher@2026`) → **Teacher** in header or `/teacher`. **Manual:** register, then admin links your email under **Admin → Teachers**.

| Section | URL | Expected behavior | Mobile | Pad | PC |
|---------|-----|-------------------|:------:|:---:|:----:|
| **My courses** | `/teacher` | Lists assigned courses; message if none assigned | ☐ | ☐ | ☐ |
| **Course detail** | `/teacher/courses/[id]` | Roster read-only; **Message student** link per row | ☐ | ☐ | ☐ |
| **Course announcements** | `/teacher/courses/[id]/announcements` | Course-wide list; create, edit, delete **own** posts; cannot edit admin posts | ☐ | ☐ | ☐ |
| **Student messages** | `/teacher/courses/[id]/students/[enrollmentId]/announcements` | Private announcements for one student only; create, edit, delete | ☐ | ☐ | ☐ |
| **My blogs** | `/teacher/blogs` | List own posts with status (draft, pending, approved, rejected) | ☐ | ☐ | ☐ |
| **New / edit blog** | `/teacher/blogs/new`, `.../edit` | Create/edit post; submit for admin approval | ☐ | ☐ | ☐ |
| **Delete blog** | Teacher blogs list or edit | Can delete own post at any approval stage | ☐ | ☐ | ☐ |
| Sign out | Sidebar | Confirmation dialog before sign out | ☐ | ☐ | ☐ |

---

## 6. Admin panel (`/admin`)

**Access (demo):** Sign in with your `ADMIN_EMAIL` address and password `Admin@2026`. **Manual/production:** register or use Google with an `ADMIN_EMAIL` address.

| Section | URL | Expected behavior | Mobile | Pad | PC |
|---------|-----|-------------------|:------:|:---:|:----:|
| **Dashboard** | `/admin` | Counts (courses, students, pending enrollments/payments/blogs/reviews); quick links | ☐ | ☐ | ☐ |
| **Announcements** | `/admin/announcements` | CRUD site-wide announcements; toggle **show on homepage** (max 4 featured) | ☐ | ☐ | ☐ |
| **Blogs** | `/admin/blogs` | Admin-authored blog posts; toggle **show on homepage** (max 4 featured) | ☐ | ☐ | ☐ |
| **Verse & Hadith** | `/admin/daily-inspiration` | Daily Quran verse / Hadith for homepage | ☐ | ☐ | ☐ |
| **Courses** | `/admin/courses` | Create/edit courses; fees, teacher, status; toggle **show on homepage** (max 6 featured); **Announcements** link per course | ☐ | ☐ | ☐ |
| **Course students** | `/admin/courses/[id]/students` | Approve enrollment requests; mark **complete**; generate/upload **certificate** and email student; nav: Students \| Announcements | ☐ | ☐ | ☐ |
| **Course announcements** | `/admin/courses/[id]/announcements` | Post course-wide announcements for any course; edit/delete all posts on that course | ☐ | ☐ | ☐ |
| **Enrollments** | `/admin/enrollments` | Pending enrollment requests across courses | ☐ | ☐ | ☐ |
| **Payment details** | `/admin/payment-settings` | Set UPI ID, payee name, bank account (shown to students on payment pages) | ☐ | ☐ | ☐ |
| **Social links** | `/admin/social-links` | Contact email, WhatsApp number, default message, Facebook / Instagram / YouTube URLs; blank URL hides icon | ☐ | ☐ | ☐ |
| **Students** | `/admin/students` | List students; view profile; remove enrollment / delete student where allowed | ☐ | ☐ | ☐ |
| **Teachers** | `/admin/teachers` | Add/edit teachers (link to registered email) | ☐ | ☐ | ☐ |
| **Library** | `/admin/library` | Digital resources; toggle **show on homepage** (max 4 featured) for public Resources page | ☐ | ☐ | ☐ |
| **Fatwa** | `/admin/fatwa` | Answer questions; toggle **show on homepage** (max 4 featured); email asker when answered | ☐ | ☐ | ☐ |
| **Blog approvals** | `/admin/blog-approvals` | Approve/reject teacher blog posts | ☐ | ☐ | ☐ |
| **Review approvals** | `/admin/review-approvals` | Approve/reject testimonials; **Remove from homepage** keeps review in **All reviews**; re-feature from All reviews | ☐ | ☐ | ☐ |
| **Payment approvals** | `/admin/payment-approvals` | Approve enrollment and monthly fee payments; **generate/upload receipt** and email student | ☐ | ☐ | ☐ |
| Sign out | Sidebar | Confirmation dialog before sign out | ☐ | ☐ | ☐ |

---

## 7. Public website pages

| Page | URL | Expected behavior | Mobile | Pad | PC |
|------|-----|-------------------|:------:|:---:|:----:|
| **Home** | `/` | Hero: Bismillah (Arabic, Indo-Pak font) + English on the **right**, academy title and tagline on the **left**; feature cards, verse/hadith, admin-selected featured courses (up to 6), homepage announcements (up to 4), featured blogs (up to 4), featured resources (up to 4), testimonials, featured fatwa answers (up to 4), fatwa CTA; footer **Contact** | ☐ | ☐ | ☐ |
| **About Us** | `/about` | Mission, values; **Contact Us** shows admin **email** and **WhatsApp** (same as footer) | ☐ | ☐ | ☐ |
| **Courses** | `/courses` | Lists published/ongoing courses; filter/browse; link to course detail | ☐ | ☐ | ☐ |
| **Course detail** | `/courses/[id]` | Description, enrollment + monthly fees, teacher, **Request enrollment** (sign-in + complete profile required) | ☐ | ☐ | ☐ |
| **Announcements** | `/announcements` | All published site announcements; open detail page | ☐ | ☐ | ☐ |
| **Announcement detail** | `/announcements/[id]` | Full announcement body; image if present | ☐ | ☐ | ☐ |
| **Blog** | `/blog` | Only **approved** posts listed | ☐ | ☐ | ☐ |
| **Blog post** | `/blog/[id]` | Full post content | ☐ | ☐ | ☐ |
| **Teachers** | `/teachers` | Public teacher profiles | ☐ | ☐ | ☐ |
| **Teacher profile** | `/teachers/[id]` | Bio, specialization, courses if shown | ☐ | ☐ | ☐ |
| **Fatwa** | `/fatwa` | Answered questions; category filters | ☐ | ☐ | ☐ |
| **Fatwa detail** | `/fatwa/[id]` | Question and scholar’s answer | ☐ | ☐ | ☐ |
| **Ask Fatwa** | `/fatwa/ask` | Signed-in users submit question; success message; email when answered (if SMTP on) | ☐ | ☐ | ☐ |
| **Resources (Library)** | `/library` | Download/view library items added by admin | ☐ | ☐ | ☐ |
| **Contact Us** | `/#contact` (header) or footer on any page | Scrolls to footer **Contact**: admin-configured email (mailto), WhatsApp, social link chips; floating WhatsApp uses admin number | ☐ | ☐ | ☐ |
| **Top bar** | All pages | Facebook / Instagram / YouTube icons match **Admin → Social links**; hidden if URL blank | ☐ | ☐ | ☐ |

### Public navigation

| Item | Expected | Mobile | Pad | PC |
|------|----------|:------:|:---:|:----:|
| Header links | Home, About Us, Courses, Announcements, Blog, Teachers, Fatwa, Resources, Contact Us | ☐ | ☐ | ☐ |
| Mobile menu | Hamburger opens/closes; all links work | ☐ | ☐ | N/A |
| Footer links | Match main sections; contact email mailto, WhatsApp, social links open correctly | ☐ | ☐ | ☐ |

---

## 8. Payments & documents (cross-role)

| Item | Expected behavior | Tester role | Mobile | Pad | PC |
|------|-------------------|-------------|:------:|:---:|:----:|
| UPI / bank on payment pages | QR and bank card match **Admin → Payment details** | Student | ☐ | ☐ | ☐ |
| Generated receipt PDF | Invoice layout: academy header, bill-to, line items, terms, **PAID** stamp | Admin → approve → send; Student downloads | ☐ | ☐ | ☐ |
| Uploaded receipt PDF | Admin upload used instead of generated PDF | Admin | ☐ | ☐ | ☐ |
| Certificate PDF | Download after course complete | Student | ☐ | ☐ | ☐ |

---

## 9. Admin content sync (quick checks)

After changing **Social links** or **Payment details**, refresh the public site and confirm:

| Admin change | Where to verify |
|--------------|-----------------|
| Contact email | Footer `/#contact`, **About Us → Contact Us** |
| WhatsApp number / message | Footer, About Us, floating green button |
| Social URLs | Top bar icons, footer contact chips |
| UPI / bank | **Profile → Payment info**, course pay pages |

---

## 10. Known limitations (not bugs)

- **SMTP:** Password reset, certificates, receipts, fatwa emails require SMTP env vars; without SMTP, links may only appear in server logs (local dev).
- **Google sign-in:** Only shown if Google OAuth env vars are set.
- **Admin role:** Granted via `ADMIN_EMAIL` on sign-in; changing admins requires updating env and redeploying (no in-app admin user management).
- **Admin profile banner:** Admins may see “Complete your profile to enroll” on `/profile` even though `/admin` does not require it (cosmetic; safe to ignore for admin work).
- **Teachers** cannot access student `/profile` (by design).
- **Teachers** cannot edit or delete admin course announcements (by design).
- **Payment / social settings** are stored in the database (admin UI), not in `.env`.
- **Uploaded files** on serverless hosting may not persist forever unless external storage is added.
- **Enrollment fees:** Courses with enrollment fee > ₹0 require payment before access; free courses (₹0) use admin approval under **Enrollments**.

---

## 11. Bug report template

```
Title: [short description]
URL: 
Device: Mobile / Pad / PC (viewport: ___px)
Role: Student / Teacher / Admin / Guest
Steps:
1. 
2. 
Expected:
Actual:
Screenshot:
```

---

## 12. Sign-off

| Tester name | Date | Environment (local/staging/prod) | Build / commit |
|-------------|------|----------------------------------|----------------|
| | | | |

| Area | Mobile | Pad | PC | Notes |
|------|:------:|:---:|:----:|-------|
| Public pages | ☐ | ☐ | ☐ | |
| Student profile | ☐ | ☐ | ☐ | |
| Teacher portal | ☐ | ☐ | ☐ | |
| Admin panel | ☐ | ☐ | ☐ | |
| Auth & email | ☐ | ☐ | ☐ | |

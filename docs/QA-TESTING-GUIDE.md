# Darse Quran Academy — QA Testing Guide

**Purpose:** Manual testing checklist for QA before release.  
**Application URL (local):** `http://localhost:3000` (or your staging/production URL)  
**Last updated:** May 2026

---

## 1. How to use this document

1. Test each area on **three device sizes** (see section 2).
2. For each row, verify **Expected behavior** matches what you see.
3. Mark result: **Pass** / **Fail** / **Blocked** / **N/A**.
4. Note bugs with: page URL, device size, steps, screenshot, and expected vs actual.

### Test accounts (prepare before testing)

| Role | How to get access | Notes |
|------|-------------------|--------|
| **Student** | Register at `/register` with a normal email (not in `ADMIN_EMAIL`) | Complete profile before enrolling |
| **Teacher** | Register, then admin adds your email under **Admin → Teachers** | Sign in → opens teacher portal |
| **Admin** | Register/sign in with email listed in `ADMIN_EMAIL` (comma-separated allowed) | Opens `/admin` |

Optional: Google sign-in if `AUTH_GOOGLE_ID` / `AUTH_GOOGLE_SECRET` are configured.

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
| Footer readable, links work | ☐ | ☐ | ☐ | Contact block, quick links, social/WhatsApp |
| Text not cut off / overlapping | ☐ | ☐ | ☐ | No clipped headings or buttons |
| Forms usable (inputs, submit) | ☐ | ☐ | ☐ | Fields full width on mobile; keyboard does not hide submit |
| Images / cards scale correctly | ☐ | ☐ | ☐ | No broken layout on course/blog cards |
| Modals / dialogs (e.g. sign out) | ☐ | ☐ | ☐ | Centered, Cancel and confirm buttons visible |

---

## 3. Authentication (all roles)

| Feature | URL | Expected behavior | Mobile | Pad | PC |
|---------|-----|-------------------|:------:|:---:|:----:|
| Sign in | `/login` | Email/password works; optional Google button if enabled; invalid credentials show error | ☐ | ☐ | ☐ |
| Register | `/register` | New student account; cannot register with admin-reserved email | ☐ | ☐ | ☐ |
| Forgot password | `/forgot-password` | Submit email → success message; reset email if SMTP configured (or link in server logs locally) | ☐ | ☐ | ☐ |
| Reset password | `/reset-password?token=…` | Set new password (min 8 chars); redirect to login with success message | ☐ | ☐ | ☐ |
| Sign out | Any signed-in page | Click **Sign Out** → dialog **“Do you want to sign out?”** → **Cancel** stays signed in; **Sign out** logs out and goes home | ☐ | ☐ | ☐ |
| Admin route guard | `/admin` | Non-admin users cannot access admin pages | ☐ | ☐ | ☐ |
| Teacher route guard | `/teacher` | Only linked teachers see portal; others redirected | ☐ | ☐ | ☐ |

---

## 4. Student profile (`/profile`)

**Access:** Sign in as student → **Profile** in header (not available to teachers; teachers use teacher portal).

| Section | URL | Expected behavior | Mobile | Pad | PC |
|---------|-----|-------------------|:------:|:---:|:----:|
| **Profile** | `/profile` | Edit name, father’s name, date of birth, occupation, address, WhatsApp; email shown; warning if profile incomplete; must complete all fields before enrollment | ☐ | ☐ | ☐ |
| **My Courses** | `/profile/courses` | Lists enrollments with status (active, awaiting approval, completed, declined, etc.); links to pay monthly fee, course announcements, download certificate when complete | ☐ | ☐ | ☐ |
| **Payments** | `/profile/payments` | History of approved payments; pending submissions; **Download receipt** when admin sent/generated receipt | ☐ | ☐ | ☐ |
| **Payment info** | `/profile/payment-info` | Shows academy UPI QR and bank details (from admin **Payment details**) | ☐ | ☐ | ☐ |
| **My reviews** | `/profile/reviews` | Submit testimonial (name, location, text); pending/approved/rejected status; edit/resubmit if rejected; delete own review | ☐ | ☐ | ☐ |

### Student flows (end-to-end)

| Flow | Steps | Expected result | Mobile | Pad | PC |
|------|-------|-----------------|:------:|:---:|:----:|
| Enroll in course | Complete profile → `/courses` → open course → enroll / pay registration | Enrollment created; free courses may need admin approval | ☐ | ☐ | ☐ |
| Pay monthly fee | **My Courses** → **Pay monthly fee** → UPI/bank → submit UTR + optional screenshot | Submission pending; appears under Payments | ☐ | ☐ | ☐ |
| After payment approved | Admin approves → admin sends receipt | Student can download invoice-style PDF from Payments | ☐ | ☐ | ☐ |
| Declined payment | Admin declines | Student sees message; can resubmit from course pay page | ☐ | ☐ | ☐ |
| Certificate | Admin marks complete + sends certificate | **Download certificate** on My Courses works | ☐ | ☐ | ☐ |
| Course announcements | `/profile/courses/[courseId]/announcements` | Student sees teacher/admin posts for enrolled course | ☐ | ☐ | ☐ |

---

## 5. Teacher portal (`/teacher`)

**Access:** User email must exist as teacher in **Admin → Teachers**. Sign in → **Teacher** in header or `/teacher`.

| Section | URL | Expected behavior | Mobile | Pad | PC |
|---------|-----|-------------------|:------:|:---:|:----:|
| **My courses** | `/teacher` | Lists assigned courses; message if none assigned | ☐ | ☐ | ☐ |
| **Course detail** | `/teacher/courses/[id]` | Roster read-only (student names/contacts); link to announcements | ☐ | ☐ | ☐ |
| **Course announcements** | `/teacher/courses/[id]/announcements` | List, create, edit, delete announcements; optional file attachment | ☐ | ☐ | ☐ |
| **My blogs** | `/teacher/blogs` | List own posts with status (draft, pending, approved, rejected) | ☐ | ☐ | ☐ |
| **New / edit blog** | `/teacher/blogs/new`, `.../edit` | Create/edit post; submit for admin approval | ☐ | ☐ | ☐ |
| Sign out | Sidebar | Confirmation dialog before sign out | ☐ | ☐ | ☐ |

---

## 6. Admin panel (`/admin`)

**Access:** Sign in with email in `ADMIN_EMAIL`.

| Section | URL | Expected behavior | Mobile | Pad | PC |
|---------|-----|-------------------|:------:|:---:|:----:|
| **Dashboard** | `/admin` | Counts (courses, students, pending enrollments/payments/blogs/reviews); quick links | ☐ | ☐ | ☐ |
| **Announcements** | `/admin/announcements` | CRUD site-wide announcements; toggle **show on homepage** (max 4 featured) | ☐ | ☐ | ☐ |
| **Blogs** | `/admin/blogs` | Admin-authored blog posts | ☐ | ☐ | ☐ |
| **Verse & Hadith** | `/admin/daily-inspiration` | Daily Quran verse / Hadith for homepage | ☐ | ☐ | ☐ |
| **Courses** | `/admin/courses` | Create/edit courses; fees, teacher, status (draft/published/etc.) | ☐ | ☐ | ☐ |
| **Course students** | `/admin/courses/[id]/students` | Approve enrollments; confirm/decline registration payment; mark **complete**; generate/upload **certificate** and email student | ☐ | ☐ | ☐ |
| **Enrollments** | `/admin/enrollments` | Pending enrollment requests across courses | ☐ | ☐ | ☐ |
| **Payment details** | `/admin/payment-settings` | Set UPI ID, payee name, bank account (shown to students) | ☐ | ☐ | ☐ |
| **Students** | `/admin/students` | List students; view profile; remove enrollment / delete student where allowed | ☐ | ☐ | ☐ |
| **Teachers** | `/admin/teachers` | Add/edit teachers (link to registered email) | ☐ | ☐ | ☐ |
| **Library** | `/admin/library` | Digital resources (PDF/links) for public Resources page | ☐ | ☐ | ☐ |
| **Fatwa** | `/admin/fatwa` | Answer questions; publish to public `/fatwa`; email asker when answered | ☐ | ☐ | ☐ |
| **Blog approvals** | `/admin/blog-approvals` | Approve/reject teacher blog posts | ☐ | ☐ | ☐ |
| **Review approvals** | `/admin/review-approvals` | Approve/reject student testimonials for homepage | ☐ | ☐ | ☐ |
| **Payment approvals** | `/admin/payment-approvals` | Approve monthly payments; **generate/upload receipt** and email student | ☐ | ☐ | ☐ |
| Sign out | Sidebar | Confirmation dialog before sign out | ☐ | ☐ | ☐ |

---

## 7. Public website pages

| Page | URL | Expected behavior | Mobile | Pad | PC |
|------|-----|-------------------|:------:|:---:|:----:|
| **Home** | `/` | Hero, feature cards, verse/hadith of the day, featured courses (up to 6), homepage announcements (up to 4), about snippet, experience banner, testimonials, fatwa teaser, learn accordion; footer **Contact** section | ☐ | ☐ | ☐ |
| **About Us** | `/about` | Mission, values, academy description; **Contact Us** section with contact details | ☐ | ☐ | ☐ |
| **Courses** | `/courses` | Lists published/ongoing courses; filter/browse; link to course detail | ☐ | ☐ | ☐ |
| **Course detail** | `/courses/[id]` | Description, fees, teacher, enroll button (sign-in required); enrollment fee / free flow | ☐ | ☐ | ☐ |
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
| **Contact Us** | `/#contact` (header) or footer on any page | Scrolls to footer contact: email, WhatsApp, social links; WhatsApp floating button works | ☐ | ☐ | ☐ |

### Public navigation

| Item | Expected | Mobile | Pad | PC |
|------|----------|:------:|:---:|:----:|
| Header links | Home, About Us, Courses, Announcements, Blog, Teachers, Fatwa, Resources, Contact Us | ☐ | ☐ | ☐ |
| Mobile menu | Hamburger opens/closes; all links work | ☐ | ☐ | N/A |
| Footer links | Match main sections; mailto and WhatsApp links open correctly | ☐ | ☐ | ☐ |

---

## 8. Payments & documents (cross-role)

| Item | Expected behavior | Tester role | Mobile | Pad | PC |
|------|-------------------|-------------|:------:|:---:|:----:|
| UPI / bank on payment pages | QR and bank card match **Admin → Payment details** | Student | ☐ | ☐ | ☐ |
| Generated receipt PDF | Invoice layout: academy header, bill-to, line items, terms, **PAID** stamp | Admin → approve → send; Student downloads | ☐ | ☐ | ☐ |
| Uploaded receipt PDF | Admin upload used instead of generated PDF | Admin | ☐ | ☐ | ☐ |
| Certificate PDF | Download after course complete | Student | ☐ | ☐ | ☐ |

---

## 9. Known limitations (not bugs)

- **SMTP:** Password reset, certificates, receipts, fatwa emails require SMTP env vars; without SMTP, links may only appear in server logs (local dev).
- **Google sign-in:** Only shown if Google OAuth env vars are set.
- **Teachers** cannot access student `/profile` (by design).
- **Uploaded files** on serverless hosting may not persist forever unless external storage is added.

---

## 10. Bug report template

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

## 11. Sign-off

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

import Link from "next/link";
import { getPendingBlogApprovalCount } from "@/lib/blog-approval";
import { getPendingContactInquiryCount } from "@/lib/contact-inquiries";
import { getPendingEnrollmentApprovalCount } from "@/lib/enrollments";
import { getPendingStudentReviewCount } from "@/lib/student-reviews";
import { getPendingPaymentCount } from "@/lib/monthly-payments";
import { prisma } from "@/lib/prisma";
import { getStudentCount } from "@/lib/students";

export default async function AdminDashboardPage() {
  const [
    courseCount,
    teacherCount,
    libraryCount,
    studentCount,
    enrollmentCount,
    pendingEnrollmentCount,
    pendingPaymentCount,
    blogCount,
    pendingBlogCount,
    pendingReviewCount,
    pendingContactCount,
    dailyInspirationCount,
    recentEnrollments,
  ] = await Promise.all([
    prisma.course.count(),
    prisma.teacher.count(),
    prisma.libraryItem.count(),
    getStudentCount(),
    prisma.enrollment.count({ where: { status: "active" } }),
    getPendingEnrollmentApprovalCount(),
    getPendingPaymentCount(),
    prisma.blogPost.count(),
    getPendingBlogApprovalCount(),
    getPendingStudentReviewCount(),
    getPendingContactInquiryCount(),
    prisma.dailyInspiration.count(),
    prisma.enrollment.findMany({
      where: { status: "active" },
      take: 5,
      orderBy: { createdAt: "desc" },
      include: { user: { select: { name: true, email: true } } },
    }),
  ]);

  const courseTitles = await prisma.course.findMany({
    where: { id: { in: recentEnrollments.map((e) => e.courseId) } },
    select: { id: true, title: true },
  });
  const titleById = new Map(courseTitles.map((c) => [c.id, c.title]));

  const stats = [
    { label: "Courses", count: courseCount, href: "/admin/courses" },
    { label: "Students", count: studentCount, href: "/admin/students" },
    { label: "Teachers", count: teacherCount, href: "/admin/teachers" },
    { label: "Library items", count: libraryCount, href: "/admin/library" },
    { label: "Blog posts", count: blogCount, href: "/admin/blogs" },
    { label: "Verse & Hadith", count: dailyInspirationCount, href: "/admin/daily-inspiration" },
    { label: "Active enrollments", count: enrollmentCount, href: "/admin/enrollments" },
    {
      label: "Enrollment requests",
      count: pendingEnrollmentCount,
      href: "/admin/enrollments",
      highlight: pendingEnrollmentCount > 0,
    },
    {
      label: "Blog approvals",
      count: pendingBlogCount,
      href: "/admin/blog-approvals",
      highlight: pendingBlogCount > 0,
    },
    {
      label: "Review approvals",
      count: pendingReviewCount,
      href: "/admin/review-approvals",
      highlight: pendingReviewCount > 0,
    },
    {
      label: "Contact inquiries",
      count: pendingContactCount,
      href: "/admin/contact-inquiries",
      highlight: pendingContactCount > 0,
    },
    {
      label: "Payment approvals",
      count: pendingPaymentCount,
      href: "/admin/payment-approvals",
      highlight: pendingPaymentCount > 0,
    },
  ];

  return (
    <div>
      <h1 className="font-serif text-2xl font-bold text-primary sm:text-3xl">Dashboard</h1>
      <p className="mt-2 text-sm text-muted">Manage academy content and view enrollment activity.</p>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className={`rounded-lg border bg-surface p-5 shadow-sm transition-shadow hover:shadow-md ${
              "highlight" in stat && stat.highlight
                ? "border-amber-300 ring-1 ring-amber-200"
                : "border-border"
            }`}
          >
            <p className="text-sm text-muted">{stat.label}</p>
            <p className="mt-1 text-3xl font-bold text-foreground">{stat.count}</p>
          </Link>
        ))}
      </div>

      <section className="mt-10">
        <h2 className="font-serif text-lg font-semibold text-foreground">Recent enrollments</h2>
        {recentEnrollments.length === 0 ? (
          <p className="mt-4 text-sm text-muted">No enrollments yet.</p>
        ) : (
          <ul className="mt-4 divide-y divide-border rounded-lg border border-border bg-surface">
            {recentEnrollments.map((enrollment) => (
              <li
                key={enrollment.id}
                className="flex flex-col gap-1 px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {titleById.get(enrollment.courseId) ?? enrollment.courseId}
                  </p>
                  <p className="text-xs text-muted">
                    {enrollment.user.name ?? enrollment.user.email}
                  </p>
                </div>
                <p className="text-xs text-muted">
                  {enrollment.createdAt.toLocaleDateString("en-IN")}
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

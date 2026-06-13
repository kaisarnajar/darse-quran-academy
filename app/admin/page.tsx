import Link from "next/link";
import { ADMIN_NAV_LINKS } from "@/lib/admin-nav";
import { getPendingBlogApprovalCount } from "@/lib/blog-approval";
import { getPendingContactInquiryCount } from "@/lib/contact-inquiries";
import {
  getAwaitingEnrollmentFeeCount,
  getPendingEnrollmentApprovalCount,
} from "@/lib/enrollments";
import { getPendingStudentReviewCount } from "@/lib/student-reviews";
import { getPendingPaymentCount } from "@/lib/monthly-payments";
import { prisma } from "@/lib/prisma";
import { getStudentCount } from "@/lib/students";

type DashboardStat = {
  label: string;
  href: string;
  count: number | null;
  highlight?: boolean;
};

export default async function AdminDashboardPage() {
  const [
    announcementCount,
    blogCount,
    dailyInspirationCount,
    courseCount,
    pendingEnrollmentCount,
    awaitingEnrollmentFeeCount,
    studentCount,
    teacherCount,
    libraryCount,
    pendingFatwaCount,
    pendingContactCount,
    pendingBlogCount,
    pendingReviewCount,
    pendingPaymentCount,
    recentEnrollments,
  ] = await Promise.all([
    prisma.siteAnnouncement.count(),
    prisma.blogPost.count(),
    prisma.dailyInspiration.count(),
    prisma.course.count(),
    getPendingEnrollmentApprovalCount(),
    getAwaitingEnrollmentFeeCount(),
    getStudentCount(),
    prisma.teacher.count(),
    prisma.libraryItem.count(),
    prisma.fatwaQuestion.count({ where: { answer: null } }),
    getPendingContactInquiryCount(),
    getPendingBlogApprovalCount(),
    getPendingStudentReviewCount(),
    getPendingPaymentCount(),
    prisma.enrollment.findMany({
      where: { status: "active" },
      take: 5,
      orderBy: { createdAt: "desc" },
      include: { user: { select: { name: true, email: true } } },
    }),
  ]);

  const countByHref = new Map<string, { count: number | null; highlight?: boolean }>([
    ["/admin/announcements", { count: announcementCount }],
    ["/admin/blogs", { count: blogCount }],
    ["/admin/daily-inspiration", { count: dailyInspirationCount }],
    ["/admin/courses", { count: courseCount }],
    [
      "/admin/enrollments",
      {
        count: pendingEnrollmentCount + awaitingEnrollmentFeeCount,
        highlight: pendingEnrollmentCount + awaitingEnrollmentFeeCount > 0,
      },
    ],
    ["/admin/payment-settings", { count: null }],
    ["/admin/social-links", { count: null }],
    ["/admin/students", { count: studentCount }],
    ["/admin/teachers", { count: teacherCount }],
    ["/admin/library", { count: libraryCount }],
    [
      "/admin/fatwa",
      { count: pendingFatwaCount, highlight: pendingFatwaCount > 0 },
    ],
    [
      "/admin/contact-inquiries",
      { count: pendingContactCount, highlight: pendingContactCount > 0 },
    ],
    [
      "/admin/blog-approvals",
      { count: pendingBlogCount, highlight: pendingBlogCount > 0 },
    ],
    [
      "/admin/review-approvals",
      { count: pendingReviewCount, highlight: pendingReviewCount > 0 },
    ],
    [
      "/admin/payment-approvals",
      { count: pendingPaymentCount, highlight: pendingPaymentCount > 0 },
    ],
  ]);

  const stats: DashboardStat[] = ADMIN_NAV_LINKS.map((link) => {
    const meta = countByHref.get(link.href) ?? { count: null };
    return {
      label: link.label,
      href: link.href,
      count: meta.count,
      highlight: meta.highlight,
    };
  });

  const courseTitles = await prisma.course.findMany({
    where: { id: { in: recentEnrollments.map((e) => e.courseId) } },
    select: { id: true, title: true },
  });
  const titleById = new Map(courseTitles.map((c) => [c.id, c.title]));

  return (
    <div>
      <h1 className="font-serif text-2xl font-bold text-primary sm:text-3xl">Dashboard</h1>
      <p className="mt-2 text-sm text-muted">Manage academy content and view enrollment activity.</p>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => (
          <Link
            key={stat.href}
            href={stat.href}
            className={`rounded-lg border bg-surface p-5 shadow-sm transition-shadow hover:shadow-md ${
              stat.highlight
                ? "border-amber-300 ring-1 ring-amber-200"
                : "border-border"
            }`}
          >
            <p className="text-sm text-muted">{stat.label}</p>
            {stat.count === null ? (
              <p className="mt-2 text-sm font-semibold text-primary">Manage →</p>
            ) : (
              <p className="mt-1 text-3xl font-bold text-foreground">{stat.count}</p>
            )}
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

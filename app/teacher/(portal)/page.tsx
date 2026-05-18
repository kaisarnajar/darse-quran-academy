import Link from "next/link";
import { CourseStatusBadge } from "@/components/admin/CourseStatusBadge";
import { requireTeacher } from "@/lib/auth-actions";
import { getCourseBannerClass } from "@/lib/course-display";
import { getCoursesForTeacher, teacherDashboardStats } from "@/lib/teacher-portal";

export default async function TeacherDashboardPage() {
  const { teacher } = await requireTeacher();
  const courses = await getCoursesForTeacher(teacher.id);
  const stats = teacherDashboardStats(courses);

  return (
    <div>
      <div className="rounded-xl border border-teal/20 bg-gradient-to-br from-teal/10 via-surface to-surface p-6 sm:p-8">
        <p className="text-sm font-semibold uppercase tracking-wide text-teal">Welcome back</p>
        <h1 className="mt-2 font-serif text-2xl font-bold text-foreground sm:text-3xl">{teacher.name}</h1>
        <p className="mt-2 max-w-xl text-sm text-muted">{teacher.specialization}</p>
        <dl className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3">
          <div className="rounded-lg border border-border bg-surface px-4 py-3">
            <dt className="text-xs text-muted">Courses</dt>
            <dd className="mt-1 text-2xl font-bold text-foreground">{stats.totalCourses}</dd>
          </div>
          <div className="rounded-lg border border-border bg-surface px-4 py-3">
            <dt className="text-xs text-muted">Students</dt>
            <dd className="mt-1 text-2xl font-bold text-foreground">{stats.totalStudents}</dd>
          </div>
          <div className="col-span-2 rounded-lg border border-border bg-surface px-4 py-3 sm:col-span-1">
            <dt className="text-xs text-muted">Login email</dt>
            <dd className="mt-1 truncate text-sm font-medium text-foreground">{teacher.email}</dd>
          </div>
        </dl>
      </div>

      <h2 className="mt-10 font-serif text-xl font-semibold text-foreground">Your courses</h2>
      <p className="mt-1 text-sm text-muted">
        View students, post announcements, and track course status.
      </p>

      {courses.length === 0 ? (
        <p className="mt-8 rounded-lg border border-dashed border-border bg-surface px-6 py-12 text-center text-sm text-muted">
          No courses are assigned to you yet. Contact the academy admin.
        </p>
      ) : (
        <ul className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
          {courses.map((course) => (
            <li key={course.id}>
              <article className="card-elevated overflow-hidden">
                <div
                  className={`flex h-24 items-center justify-center bg-gradient-to-br ${getCourseBannerClass(course.category)} px-4 text-white`}
                >
                  <span className="text-2xl font-bold opacity-40" aria-hidden>
                    {course.category.charAt(0)}
                  </span>
                </div>
                <div className="p-5">
                  <div className="flex flex-wrap items-center gap-2">
                    <CourseStatusBadge status={course.status} />
                    <span className="rounded-full bg-stone-100 px-2.5 py-0.5 text-xs font-medium text-stone-700">
                      {course.level}
                    </span>
                  </div>
                  <h3 className="mt-3 text-lg font-bold text-foreground">{course.title}</h3>
                  <p className="mt-1 text-sm text-muted">
                    {course.category} · Starts {course.startDate}
                  </p>
                  <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted">{course.description}</p>
                  <p className="mt-4 text-sm text-muted">
                    <span className="font-semibold text-foreground">{course.studentCount}</span>{" "}
                    student{course.studentCount === 1 ? "" : "s"} enrolled
                  </p>
                  <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                    <Link
                      href={`/teacher/courses/${course.id}`}
                      className="btn-gold-solid inline-flex flex-1 items-center justify-center py-2.5 text-xs"
                    >
                      Students
                    </Link>
                    <Link
                      href={`/teacher/courses/${course.id}/announcements`}
                      className="inline-flex flex-1 items-center justify-center rounded-full border border-teal bg-surface py-2.5 text-xs font-semibold text-teal transition-colors hover:bg-teal/5"
                    >
                      Announcements
                    </Link>
                  </div>
                </div>
              </article>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CourseEnrollButton } from "@/components/auth/CourseEnrollButton";
import { CoursePricingDisplay } from "@/components/courses/CoursePricingDisplay";
import { CourseTeacherInfo } from "@/components/courses/CourseTeacherInfo";
import { Section } from "@/components/site/Section";
import { auth } from "@/lib/auth";
import { CourseStatusPill } from "@/components/courses/CourseStatusPill";
import { getCourseBannerClass, getCourseLevelClass } from "@/lib/course-display";
import { getPublicCourseById } from "@/lib/courses";
import { getUserCourseEnrollmentMap } from "@/lib/enrollments";
import { isUserProfileComplete } from "@/lib/profile";

type CoursePageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: CoursePageProps): Promise<Metadata> {
  const { id } = await params;
  const course = await getPublicCourseById(id);
  if (!course) return { title: "Course not found" };
  return {
    title: course.title,
    description: course.description.slice(0, 160),
  };
}

export default async function CourseDetailPage({ params }: CoursePageProps) {
  const { id } = await params;
  const course = await getPublicCourseById(id);
  if (!course) notFound();

  const session = await auth();
  const enrollmentMap = session?.user?.id
    ? await getUserCourseEnrollmentMap(session.user.id)
    : new Map();
  const enrollment = enrollmentMap.get(course.id);
  const profileComplete = session?.user?.id
    ? await isUserProfileComplete(session.user.id)
    : true;
  const levelClass = getCourseLevelClass(course.level);

  return (
    <Section>
      <Link href="/courses" className="text-sm font-medium text-gold hover:underline">
        ← All courses
      </Link>

      <article className="mx-auto mt-6 max-w-2xl">
        <div
          className={`flex h-40 items-center justify-center rounded-lg bg-gradient-to-br ${getCourseBannerClass(course.category)} text-white sm:h-48`}
        >
          <span className="text-5xl font-bold opacity-30" aria-hidden>
            {course.category.charAt(0)}
          </span>
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wide text-gold">
            {course.category}
          </span>
          <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${levelClass}`}>
            {course.level}
          </span>
          <CourseStatusPill status={course.status} />
        </div>

        <h1 className="mt-3 text-2xl font-bold text-foreground sm:text-3xl">{course.title}</h1>
        <p className="mt-2 text-sm text-muted">Starts: {course.startDate}</p>

        <p className="mt-6 text-base leading-relaxed text-muted">{course.description}</p>

        <CourseTeacherInfo teacher={course.teacher} />

        <div className="mt-6 rounded-lg border border-border bg-background/40 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-gold">Fees</p>
          <CoursePricingDisplay level={course.level} className="mt-2" />
          <p className="mt-3 text-xs text-muted">
            Enrollment is free after admin approval. Monthly fees are paid from your profile after you are enrolled.
          </p>
        </div>

        <div className="mt-8">
          <CourseEnrollButton
            courseId={course.id}
            level={course.level}
            courseStatus={course.status}
            isEnrolled={enrollment?.status === "active" || enrollment?.status === "completed"}
            enrollmentStatus={enrollment?.status ?? null}
            enrollmentId={enrollment?.id ?? null}
            profileComplete={profileComplete}
          />
        </div>
      </article>
    </Section>
  );
}

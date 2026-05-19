import Link from "next/link";
import { SplitSectionTitle } from "@/components/site/SplitSectionTitle";
import { CoursePricingDisplay } from "@/components/courses/CoursePricingDisplay";
import { CourseTeacherInfo } from "@/components/courses/CourseTeacherInfo";
import { getCourseBannerClass } from "@/lib/course-display";
import type { CourseWithTeacher } from "@/lib/courses";

type FeaturedCoursesProps = {
  courses: CourseWithTeacher[];
};

export function FeaturedCourses({ courses }: FeaturedCoursesProps) {
  return (
    <section className="bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="text-center">
          <SplitSectionTitle muted="Featured" accent="Courses" />
        </div>
        <ul className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {courses.map((course) => {
            const detailHref = `/courses/${course.id}`;
            return (
              <li key={course.id} className="card-elevated overflow-hidden p-0">
                <Link
                  href={detailHref}
                  className={`flex h-40 items-center justify-center bg-gradient-to-br ${getCourseBannerClass(course.category)} text-white`}
                >
                  <span className="text-4xl font-bold opacity-30" aria-hidden>
                    {course.category.charAt(0)}
                  </span>
                </Link>
                <div className="p-5">
                  <span className="text-xs font-semibold uppercase tracking-wide text-gold">
                    {course.category}
                  </span>
                  <h3 className="mt-2 text-lg font-bold text-foreground">
                    <Link href={detailHref} className="hover:text-gold">
                      {course.title}
                    </Link>
                  </h3>
                  <p className="mt-2 line-clamp-2 text-sm text-muted">{course.description}</p>
                  <CourseTeacherInfo teacher={course.teacher} compact />
                  <CoursePricingDisplay course={course} className="mt-2" compact />
                  <Link
                    href={detailHref}
                    className="btn-gold-outline mt-4 inline-flex w-full items-center justify-center py-2.5 text-xs"
                  >
                    Course Details
                  </Link>
                </div>
              </li>
            );
          })}
        </ul>
        {courses.length === 0 && (
          <p className="mt-8 text-center text-muted">New courses will be announced soon.</p>
        )}
        <div className="mt-10 text-center">
          <Link href="/courses" className="btn-gold-solid inline-flex px-8 py-3 text-sm">
            View All Courses
          </Link>
        </div>
      </div>
    </section>
  );
}

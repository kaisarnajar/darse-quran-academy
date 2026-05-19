import {
  formatEnrollmentFeeLabel,
  getCoursePricingFromCourse,
  type CourseFeeSource,
} from "@/lib/course-pricing";

type CoursePricingDisplayProps = {
  course: CourseFeeSource;
  className?: string;
  compact?: boolean;
};

export function CoursePricingDisplay({
  course,
  className = "",
  compact = false,
}: CoursePricingDisplayProps) {
  const pricing = getCoursePricingFromCourse(course);
  const enrollmentLabel = formatEnrollmentFeeLabel(course);

  if (compact) {
    return (
      <p className={`text-sm text-muted ${className}`}>
        Enrollment: {enrollmentLabel} ·{" "}
        <span className="font-semibold text-foreground">₹{pricing.monthlyFeeInr}</span>/mo
      </p>
    );
  }

  return (
    <div className={`space-y-1 ${className}`}>
      <p className="text-sm text-muted">
        <span className="font-medium text-foreground">Enrollment:</span> {enrollmentLabel}
      </p>
      <p className="text-sm text-muted">
        <span className="font-medium text-foreground">Monthly fee:</span> ₹{pricing.monthlyFeeInr}
        /month
      </p>
    </div>
  );
}

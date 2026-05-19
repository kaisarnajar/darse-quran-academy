import { getCoursePricing } from "@/lib/course-pricing";

type CoursePricingDisplayProps = {
  level: string;
  className?: string;
  compact?: boolean;
};

export function CoursePricingDisplay({
  level,
  className = "",
  compact = false,
}: CoursePricingDisplayProps) {
  const pricing = getCoursePricing(level);

  if (compact) {
    return (
      <p className={`text-sm text-muted ${className}`}>
        Free enrollment ·{" "}
        <span className="font-semibold text-foreground">₹{pricing.monthlyFeeInr}</span>/mo
      </p>
    );
  }

  return (
    <div className={`space-y-1 ${className}`}>
      <p className="text-sm text-muted">
        <span className="font-medium text-foreground">Enrollment:</span> Free (admin approval)
      </p>
      <p className="text-sm text-muted">
        <span className="font-medium text-foreground">Monthly fee:</span> ₹{pricing.monthlyFeeInr}
        /month
      </p>
    </div>
  );
}

type CourseDurationDisplayProps = {
  duration: string;
  className?: string;
};

export function CourseDurationDisplay({ duration, className = "" }: CourseDurationDisplayProps) {
  if (!duration.trim()) return null;

  return (
    <p className={`text-sm text-muted ${className}`.trim()}>
      Duration: <span className="text-foreground">{duration}</span>
    </p>
  );
}

type SplitSectionTitleProps = {
  muted: string;
  accent: string;
  className?: string;
  as?: "h2" | "h3";
};

export function SplitSectionTitle({
  muted,
  accent,
  className = "",
  as: Tag = "h2",
}: SplitSectionTitleProps) {
  return (
    <Tag className={`section-title-split text-2xl sm:text-3xl ${className}`}>
      <span className="title-muted">{muted} </span>
      <span className="title-accent">{accent}</span>
    </Tag>
  );
}

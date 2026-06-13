const actionButtonClass =
  "inline-flex min-h-9 items-center justify-center rounded-md border border-border bg-surface px-3 py-1.5 text-xs font-semibold text-foreground transition-colors hover:bg-background/80";

export function ViewCertificateButton({ enrollmentId }: { enrollmentId: string }) {
  return (
    <a
      href={`/api/certificate/${enrollmentId}?inline=1`}
      target="_blank"
      rel="noopener noreferrer"
      className={actionButtonClass}
    >
      View
    </a>
  );
}

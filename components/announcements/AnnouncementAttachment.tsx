import Link from "next/link";

type AnnouncementAttachmentProps = {
  attachmentPath: string;
  attachmentName: string;
};

export function AnnouncementAttachment({ attachmentPath, attachmentName }: AnnouncementAttachmentProps) {
  return (
    <div className="mt-4 rounded-lg border border-border bg-background/50 px-4 py-3">
      <p className="text-xs font-semibold uppercase tracking-wide text-muted">Attached material</p>
      <Link
        href={attachmentPath}
        target="_blank"
        rel="noopener noreferrer"
        download={attachmentName}
        className="mt-2 inline-block text-sm font-medium text-teal hover:underline"
      >
        Download: {attachmentName}
      </Link>
    </div>
  );
}

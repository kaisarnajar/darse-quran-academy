import Link from "next/link";

type CoursesPageNavProps = {
  active: "courses" | "payment";
};

const tabClass = (active: boolean) =>
  `rounded-full px-4 py-2 text-sm font-medium transition-colors ${
    active
      ? "bg-primary text-white"
      : "border border-border text-foreground hover:bg-accent-muted/50"
  }`;

export function CoursesPageNav({ active }: CoursesPageNavProps) {
  return (
    <nav
      className="mt-8 flex flex-wrap justify-center gap-2 border-b border-border pb-4"
      aria-label="Courses sections"
    >
      <Link href="/courses" className={tabClass(active === "courses")}>
        Courses
      </Link>
      <Link href="/courses?tab=payment" className={tabClass(active === "payment")}>
        Payment details
      </Link>
    </nav>
  );
}

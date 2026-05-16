import type { ReactNode } from "react";

type SectionProps = {
  children: ReactNode;
  className?: string;
  id?: string;
};

export function Section({ children, className = "", id }: SectionProps) {
  return (
    <section id={id} className={`mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 lg:py-16 ${className}`}>
      {children}
    </section>
  );
}

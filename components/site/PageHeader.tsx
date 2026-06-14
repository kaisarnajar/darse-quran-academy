import type { ReactNode } from "react";

type PageHeaderProps = {
  title: string;
  description: ReactNode;
};

export function PageHeader({ title, description }: PageHeaderProps) {
  return (
    <div className="mx-auto max-w-2xl text-center">
      <span className="mx-auto mb-3 block h-1 w-12 rounded-full bg-gold" aria-hidden />
      <h1 className="text-2xl font-bold uppercase tracking-wide text-foreground sm:text-3xl md:text-4xl">
        {title}
      </h1>
      <p className="mt-3 text-sm leading-relaxed text-muted sm:mt-4 sm:text-base">{description}</p>
    </div>
  );
}

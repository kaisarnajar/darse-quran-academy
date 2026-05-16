type PageHeaderProps = {
  title: string;
  description: string;
};

export function PageHeader({ title, description }: PageHeaderProps) {
  return (
    <div className="mx-auto max-w-2xl text-center">
      <h1 className="font-serif text-2xl font-bold text-primary sm:text-3xl md:text-4xl">{title}</h1>
      <p className="mt-3 text-sm leading-relaxed text-muted sm:mt-4 sm:text-base">{description}</p>
    </div>
  );
}

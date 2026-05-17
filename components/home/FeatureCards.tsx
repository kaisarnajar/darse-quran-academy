const features = [
  {
    title: "After Isha Salah",
    description:
      "Classes are held after Isha salah, so you can work during the day and manage your prayers properly.",
    icon: (
      <svg className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
        />
      </svg>
    ),
  },
  {
    title: "Completion Certificates",
    description:
      "Earn recognized certificates when you complete structured courses and assessments.",
    icon: (
      <svg className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
        />
      </svg>
    ),
  },
];

export function FeatureCards() {
  return (
    <section className="pattern-islamic relative pb-16 pt-4">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mx-auto grid max-w-4xl grid-cols-1 gap-6 md:grid-cols-2 md:gap-8">
          {features.map((feature) => (
            <article
              key={feature.title}
              className="feature-card card-elevated flex flex-col items-center p-8 text-center"
            >
              <span className="text-gold">{feature.icon}</span>
              <h3 className="mt-4 text-lg font-bold uppercase tracking-wide text-foreground">
                {feature.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-muted">{feature.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

import Link from "next/link";
import { buildFinanceQueryString, FINANCE_TABS, type FinanceFilters } from "@/lib/finance-filters";

type FinanceTabsProps = {
  filters: FinanceFilters;
};

export function FinanceTabs({ filters }: FinanceTabsProps) {
  return (
    <nav className="flex flex-wrap gap-2 border-b border-border pb-4" aria-label="Finance sections">
      {FINANCE_TABS.map((item) => {
        const active = filters.tab === item.tab;
        const href = `/admin/finance${buildFinanceQueryString({ ...filters, tab: item.tab })}`;

        return (
          <Link
            key={item.tab}
            href={href}
            className={`rounded-full px-5 py-2 text-sm font-medium ${
              active
                ? "bg-primary text-white"
                : "border border-border text-foreground hover:bg-accent-muted/50"
            }`}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

export const inputClassName =
  "mt-1 w-full rounded-md border border-border bg-surface px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary";

export const labelClassName = "block text-sm font-medium text-foreground";

export function rupeesToPaise(rupees: number): number {
  return Math.round(rupees * 100);
}

export const inputClassName =
  "mt-1 w-full rounded-md border border-border bg-surface px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary";

export const labelClassName = "block text-sm font-medium text-foreground";

export function parseCheckbox(formData: FormData, name: string): boolean {
  const value = formData.get(name);
  return value === "on" || value === "true" || value === "1";
}

export function rupeesToPaise(rupees: number): number {
  return Math.round(rupees * 100);
}

export function paiseToRupees(paise: number): number {
  return paise / 100;
}

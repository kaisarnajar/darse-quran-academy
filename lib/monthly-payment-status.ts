export const PAYMENT_TYPE_MONTHLY = "monthly" as const;
export const PAYMENT_TYPE_ENROLLMENT = "enrollment" as const;

export const MONTHLY_PAYMENT_PENDING = "pending_verification" as const;
export const MONTHLY_PAYMENT_APPROVED = "approved" as const;
export const MONTHLY_PAYMENT_DECLINED = "declined" as const;

export function paymentTypeLabel(paymentType: string): string {
  if (paymentType === PAYMENT_TYPE_ENROLLMENT) return "Enrollment fee";
  return "Monthly fee";
}

export function monthlyPaymentStatusLabel(status: string): string {
  if (status === MONTHLY_PAYMENT_PENDING) return "Awaiting verification";
  if (status === MONTHLY_PAYMENT_APPROVED) return "Approved";
  if (status === MONTHLY_PAYMENT_DECLINED) return "Declined — resubmit";
  return status.replace(/_/g, " ");
}

export function monthlyPaymentStatusClass(status: string): string {
  if (status === MONTHLY_PAYMENT_APPROVED) return "bg-emerald-100 text-emerald-900";
  if (status === MONTHLY_PAYMENT_PENDING) return "bg-amber-100 text-amber-900";
  if (status === MONTHLY_PAYMENT_DECLINED) return "bg-red-100 text-red-900";
  return "bg-stone-200 text-stone-700";
}

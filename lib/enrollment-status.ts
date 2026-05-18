/** Submitted payment details; awaiting admin confirm or decline */
export const AWAITING_PAYMENT_VERIFICATION = "pending_verification" as const;

/** Checkout started or admin declined — student must pay / resubmit on payment page */
export const NEEDS_PAYMENT_SUBMISSION = "pending" as const;

/** Admin declined the submitted payment — student must resubmit for verification */
export const PAYMENT_DECLINED = "payment_declined" as const;

export function isAwaitingPaymentVerification(status: string): boolean {
  return status === AWAITING_PAYMENT_VERIFICATION;
}

export function needsPaymentSubmission(status: string): boolean {
  return status === NEEDS_PAYMENT_SUBMISSION || status === PAYMENT_DECLINED;
}

export function canSubmitPaymentForVerification(status: string): boolean {
  return needsPaymentSubmission(status);
}

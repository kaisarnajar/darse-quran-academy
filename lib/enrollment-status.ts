/** Student requested enrollment; awaiting admin approval (no registration fee). */
export const PENDING_ENROLLMENT_APPROVAL = "pending_approval" as const;

/** @deprecated Legacy registration payment flow */
export const AWAITING_PAYMENT_VERIFICATION = "pending_verification" as const;

/** @deprecated Legacy registration payment flow */
export const NEEDS_PAYMENT_SUBMISSION = "pending" as const;

/** @deprecated Legacy registration payment flow */
export const PAYMENT_DECLINED = "payment_declined" as const;

export function isPendingEnrollmentApproval(status: string): boolean {
  return status === PENDING_ENROLLMENT_APPROVAL;
}

export function isAwaitingPaymentVerification(status: string): boolean {
  return status === AWAITING_PAYMENT_VERIFICATION;
}

export function needsPaymentSubmission(status: string): boolean {
  return status === NEEDS_PAYMENT_SUBMISSION || status === PAYMENT_DECLINED;
}

export function canSubmitPaymentForVerification(status: string): boolean {
  return needsPaymentSubmission(status);
}

export function canApproveEnrollment(status: string): boolean {
  return (
    status === PENDING_ENROLLMENT_APPROVAL ||
    status === AWAITING_PAYMENT_VERIFICATION ||
    status === NEEDS_PAYMENT_SUBMISSION
  );
}

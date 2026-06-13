/** Student requested enrollment; awaiting admin approval (free courses). */
export const PENDING_ENROLLMENT_APPROVAL = "pending_approval" as const;

/** Paid course: enrollment created; student must pay enrollment fee. */
export const AWAITING_ENROLLMENT_FEE = "awaiting_enrollment_fee" as const;

export function isPendingEnrollmentApproval(status: string): boolean {
  return status === PENDING_ENROLLMENT_APPROVAL;
}

export function isAwaitingEnrollmentFee(status: string): boolean {
  return status === AWAITING_ENROLLMENT_FEE;
}

export function canApproveEnrollment(status: string): boolean {
  return status === PENDING_ENROLLMENT_APPROVAL;
}

export function canRejectEnrollment(status: string): boolean {
  return status === PENDING_ENROLLMENT_APPROVAL || status === AWAITING_ENROLLMENT_FEE;
}

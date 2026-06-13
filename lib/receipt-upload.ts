/** Public path for an admin-uploaded or seeded payment receipt PDF. */
export function receiptUploadPath(paymentRecordId: string) {
  return `/uploads/receipts/${paymentRecordId}.pdf`;
}

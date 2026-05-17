import QRCode from "qrcode";

export type UpiPaymentParams = {
  amountPaise: number;
  payeeName: string;
  note: string;
  transactionRef: string;
};

export function isUpiConfigured(): boolean {
  return Boolean(process.env.UPI_ID?.trim());
}

export function getUpiId(): string {
  return process.env.UPI_ID?.trim() ?? "";
}

export function getUpiPayeeName(): string {
  return process.env.UPI_PAYEE_NAME?.trim() || "Darse Quran Academy";
}

export function formatUpiAmount(amountPaise: number): string {
  return (amountPaise / 100).toFixed(2);
}

export function buildUpiPaymentUrl(params: UpiPaymentParams): string {
  const vpa = getUpiId();
  const query = new URLSearchParams({
    pa: vpa,
    pn: params.payeeName.slice(0, 50),
    am: formatUpiAmount(params.amountPaise),
    cu: "INR",
    tn: params.note.slice(0, 80),
    tr: params.transactionRef.slice(0, 35),
  });
  return `upi://pay?${query.toString()}`;
}

export async function generateUpiQrDataUrl(upiUrl: string): Promise<string> {
  return QRCode.toDataURL(upiUrl, {
    width: 280,
    margin: 2,
    color: { dark: "#1c1917", light: "#ffffff" },
  });
}

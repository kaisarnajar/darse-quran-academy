import { Noto_Nastaliq_Urdu } from "next/font/google";

/** Indo-Pak Nastaleeq style for Arabic / Urdu scripture display */
export const indoPakArabic = Noto_Nastaliq_Urdu({
  subsets: ["arabic"],
  weight: ["400", "700"],
  display: "swap",
  variable: "--font-indo-pak",
});

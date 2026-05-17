export { auth as proxy } from "@/lib/auth";

export const config = {
  matcher: ["/my-courses/:path*", "/admin/:path*"],
};

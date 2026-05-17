export { auth as middleware } from "@/lib/auth";

export const config = {
  matcher: ["/my-courses/:path*", "/admin/:path*"],
};

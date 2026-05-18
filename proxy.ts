export { auth as proxy } from "@/lib/auth";

export const config = {
  matcher: ["/profile/:path*", "/my-courses/:path*", "/admin/:path*", "/teacher/:path*"],
};

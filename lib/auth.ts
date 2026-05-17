import { PrismaAdapter } from "@auth/prisma-adapter";
import { compare } from "bcryptjs";
import NextAuth from "next-auth";
import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import { isAdminEmail } from "@/lib/admin";
import { prisma } from "@/lib/prisma";

const googleConfigured =
  Boolean(process.env.AUTH_GOOGLE_ID) && Boolean(process.env.AUTH_GOOGLE_SECRET);

function resolveRole(email: string | null | undefined): "USER" | "ADMIN" {
  return isAdminEmail(email) ? "ADMIN" : "USER";
}

export const authConfig = {
  adapter: PrismaAdapter(prisma),
  providers: [
    ...(googleConfigured
      ? [
          Google({
            clientId: process.env.AUTH_GOOGLE_ID!,
            clientSecret: process.env.AUTH_GOOGLE_SECRET!,
            allowDangerousEmailAccountLinking: true,
          }),
        ]
      : []),
    Credentials({
      name: "Email and Password",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const email = String(credentials.email).toLowerCase().trim();
        const user = await prisma.user.findUnique({ where: { email } });

        if (!user?.password) return null;

        const valid = await compare(String(credentials.password), user.password);
        if (!valid) return null;

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
        };
      },
    }),
  ],
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user?.id) {
        token.id = user.id;
      }
      if (token.email) {
        token.role = resolveRole(token.email as string);
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        if (token.id) {
          session.user.id = token.id as string;
        }
        session.user.role = (token.role as "USER" | "ADMIN") ?? resolveRole(session.user.email);
      }
      return session;
    },
    authorized({ auth, request }) {
      const { pathname } = request.nextUrl;

      if (pathname.startsWith("/admin")) {
        return auth?.user?.role === "ADMIN";
      }

      if (pathname.startsWith("/my-courses")) {
        return !!auth?.user;
      }

      return true;
    },
  },
  trustHost: true,
} satisfies NextAuthConfig;

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);

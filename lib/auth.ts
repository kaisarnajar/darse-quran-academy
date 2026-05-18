import { PrismaAdapter } from "@auth/prisma-adapter";
import { compare } from "bcryptjs";
import NextAuth from "next-auth";
import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import { prisma } from "@/lib/prisma";
import { getTeacherByEmail, resolveUserRole } from "@/lib/teacher-auth";

const googleConfigured =
  Boolean(process.env.AUTH_GOOGLE_ID) && Boolean(process.env.AUTH_GOOGLE_SECRET);

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
        const role = await resolveUserRole(token.email as string);
        token.role = role;
        if (role === "TEACHER") {
          const teacher = await getTeacherByEmail(token.email as string);
          token.teacherId = teacher?.id;
        } else {
          token.teacherId = undefined;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        if (token.id) {
          session.user.id = token.id as string;
        }
        session.user.role =
          (token.role as "USER" | "ADMIN" | "TEACHER") ??
          (await resolveUserRole(session.user.email));
        if (token.teacherId) {
          session.user.teacherId = token.teacherId as string;
        }
      }
      return session;
    },
    authorized({ auth, request }) {
      const { pathname } = request.nextUrl;

      if (pathname.startsWith("/admin")) {
        return auth?.user?.role === "ADMIN";
      }

      if (pathname.startsWith("/teacher")) {
        return auth?.user?.role === "TEACHER";
      }

      if (pathname.startsWith("/profile") || pathname.startsWith("/my-courses")) {
        if (auth?.user?.role === "TEACHER") return false;
        return !!auth?.user;
      }

      return true;
    },
  },
  trustHost: true,
} satisfies NextAuthConfig;

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);

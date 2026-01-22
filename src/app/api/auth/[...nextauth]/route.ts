import NextAuth, { type AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export const authOptions: AuthOptions = {
  session: {
    strategy: "jwt",
  },

  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials) {
        // 🔴 VALIDASI INPUT
        if (!credentials?.email || !credentials.password) {
          throw new Error("MISSING_CREDENTIALS");
        }

        // 🔍 CARI USER
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
          include: {
            roles: {
              include: {
                role: true,
              },
            },
          },
        });

        // ❌ EMAIL TIDAK TERDAFTAR
        if (!user) {
          throw new Error("EMAIL TIDAK TERDAFTAR");
        }

        // 🔐 CEK PASSWORD
        const isValidPassword = await bcrypt.compare(
          credentials.password,
          user.passwordHash
        );

        // ❌ PASSWORD SALAH
        if (!isValidPassword) {
          throw new Error("PASSWORD SALAH");
        }

        // ✅ LOGIN BERHASIL
        return {
          id: user.id,
          email: user.email,
          roles: user.roles.map((r) => r.role.name),
        };
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.userId = user.id;
        token.roles = (user as any).roles;
      }
      return token;
    },

    async session({ session, token }) {
      session.userId = token.userId as string;
      session.roles = (token.roles as string[]) ?? [];
      return session;
    },
  },

  pages: {
    signIn: "/auth/login",
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };

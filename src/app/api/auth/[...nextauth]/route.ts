export const dynamic = "force-dynamic";
import NextAuth, { type AuthOptions, type User as NextAuthUser } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

interface AuthUser {
  id: string;
  email: string;
  roles: string[];
}

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
        if (!credentials?.email || !credentials.password) {
          throw new Error("MISSING_CREDENTIALS");
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
          include: { roles: true },
        });

        if (!user) {
          throw new Error("EMAIL TIDAK TERDAFTAR");
        }

        const isValidPassword = await bcrypt.compare(
          credentials.password,
          user.passwordHash
        );

        if (!isValidPassword) {
          throw new Error("PASSWORD SALAH");
        }

        return {
          id: user.id,
          email: user.email!,
          roles: user.roles.map((r) => r.name),
        } as AuthUser;
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        const authUser = user as AuthUser;
        token.userId = authUser.id;
        token.roles = authUser.roles;
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

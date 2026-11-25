import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { authConfig } from "@/auth.config";

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  session: { strategy: "jwt" },
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const email = credentials?.email;
        const password = credentials?.password;
        const ownerEmail = process.env.OWNER_EMAIL;
        const ownerPasswordHash = process.env.OWNER_PASSWORD_HASH;

        if (
          typeof email !== "string" ||
          typeof password !== "string" ||
          !ownerEmail ||
          !ownerPasswordHash ||
          email.trim().toLowerCase() !== ownerEmail.trim().toLowerCase()
        ) {
          return null;
        }

        const passwordMatches = await bcrypt.compare(password, ownerPasswordHash);
        if (!passwordMatches) return null;

        return {
          id: "owner",
          name: process.env.OWNER_NAME || "Owner",
          email: ownerEmail,
        };
      },
    }),
  ],
});

import NextAuth from "next-auth";

import Credentials from "next-auth/providers/credentials";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { db } from "@/lib/db";
import { accounts, sessions, users, verificationTokens } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: DrizzleAdapter(db, {
    usersTable: users as any,
    accountsTable: accounts as any,
    sessionsTable: sessions as any,
    verificationTokensTable: verificationTokens as any,
  }),
  providers: [
    Credentials({
      id: "email-password",
      name: "E-posta ve Şifre",
      credentials: {
        email: { label: "E-posta", type: "email" },
        password: { label: "Şifre", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        
        const user = await db.query.users.findFirst({
          where: eq(users.email, credentials.email as string)
        });

        if (!user) throw new Error("Bu e-posta adresine ait bir hesap bulunamadı.");

        if (user.role === "banned") {
          throw new Error("Hesabınız devre dışı bırakılmıştır.");
        }

        if (!user.passwordHash) {
          throw new Error("Bu hesap için parola tanımlı değil.");
        }

        if (!bcrypt.compareSync(credentials.password as string, user.passwordHash)) {
          throw new Error("Hatalı şifre girdiniz.");
        }

        // Personel hesapları 2FA'yı atlayamasın: sadece "admin-2fa" provider'ı ile girebilirler.
        if (user.role === "admin" || user.role === "technician") {
          throw new Error("Personel hesapları yalnızca yönetici giriş sayfasından (2FA ile) giriş yapabilir.");
        }

        return { id: user.id, email: user.email, role: user.role, name: user.name };
      }
    }),
    Credentials({
      id: "admin-2fa",
      name: "Admin 2FA",
      credentials: {
        email: { label: "E-posta", type: "email" },
        otp: { label: "Doğrulama Kodu", type: "text" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.otp) return null;

        const email = credentials.email as string;
        const otp = credentials.otp as string;

        const user = await db.query.users.findFirst({
          where: eq(users.email, email)
        });

        if (!user) throw new Error("Bu e-posta adresine ait bir hesap bulunamadı.");
        if (user.role !== "admin" && user.role !== "technician") {
          throw new Error("Bu sayfaya erişim yetkiniz bulunmamaktadır.");
        }

        if (process.env.ALLOW_DEV_OTP_BYPASS === "true" && process.env.NODE_ENV === "development" && otp === "123456") {
          console.warn("[auth] DEV OTP bypass used for", email);
          return { id: user.id, email: user.email, role: user.role, name: user.name };
        }

        // Check verificationTokens table
        const tokenRecord = await db.query.verificationTokens.findFirst({
          where: eq(verificationTokens.identifier, `admin-otp:${email}`)
        });

        if (!tokenRecord) {
          throw new Error("Doğrulama kodu bulunamadı. Lütfen yeni bir kod isteyin.");
        }

        if (tokenRecord.token !== otp) {
          throw new Error("Hatalı doğrulama kodu girdiniz.");
        }

        if (new Date() > tokenRecord.expires) {
          await db.delete(verificationTokens)
            .where(eq(verificationTokens.identifier, `admin-otp:${email}`));
          throw new Error("Doğrulama kodunun süresi dolmuş. Lütfen tekrar deneyin.");
        }

        // Success - clean up token
        await db.delete(verificationTokens)
          .where(eq(verificationTokens.identifier, `admin-otp:${email}`));

        return { id: user.id, email: user.email, role: user.role, name: user.name };
      }
    })
  ],
  session: { strategy: "jwt" },
  pages: {
    signIn: "/giris",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role || "customer";
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        (session.user as any).role = token.role as string;
      }
      return session;
    },
  },
});

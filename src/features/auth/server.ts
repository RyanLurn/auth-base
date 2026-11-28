import "@tanstack/react-start/server-only";
import { drizzleAdapter } from "@better-auth/drizzle-adapter/relations-v2";
import { betterAuth } from "better-auth/minimal";
import { haveIBeenPwned } from "better-auth/plugins";
import { tanstackStartCookies } from "better-auth/tanstack-start";
import { createElement } from "react";

import { APP_NAME } from "@/config/constants";
import { env } from "@/config/env.server";
import { db } from "@/db";
import {
  accountTable,
  sessionTable,
  verificationTable,
} from "@/db/schema/tables/auth";
import { userTable } from "@/db/schema/tables/user";
import {
  COOKIE_PREFIX,
  EMAIL_VERIFICATION_EXPIRES_IN_MINUTES,
  MAX_PASSWORD_LENGTH,
  MIN_PASSWORD_LENGTH,
  RESET_PASSWORD_TOKEN_EXPIRES_IN_MINUTES,
  SESSION_DATA_COOKIE_SUFFIX,
  SESSION_TOKEN_COOKIE_SUFFIX,
} from "@/features/auth/constants";
import ResetPassword from "@/features/email/components/emails/reset-password";
import VerifyEmail from "@/features/email/components/emails/verify-email";
import { sendEmail } from "@/features/email/operations/send";

export const authServer = betterAuth({
  appName: APP_NAME,
  baseURL: env.BETTER_AUTH_URL,
  secrets: [env.BETTER_AUTH_SECRET_VERSION_1],
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      user: userTable,
      session: sessionTable,
      account: accountTable,
      verification: verificationTable,
    },
    transaction: true,
  }),
  advanced: {
    database: {
      generateId: false,
      joins: true,
    },
    cookiePrefix: COOKIE_PREFIX,
    cookies: {
      session_token: {
        name: SESSION_TOKEN_COOKIE_SUFFIX,
      },
      session_data: {
        name: SESSION_DATA_COOKIE_SUFFIX,
      },
    },
  },
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    minPasswordLength: MIN_PASSWORD_LENGTH,
    maxPasswordLength: MAX_PASSWORD_LENGTH,
    revokeSessionsOnPasswordReset: true,
    resetPasswordTokenExpiresIn: RESET_PASSWORD_TOKEN_EXPIRES_IN_MINUTES,
    sendResetPassword: async ({ user, url }) => {
      void sendEmail({
        to: user.email,
        subject: "Reset your password",
        reactEmail: createElement(ResetPassword, {
          name: user.name,
          resetUrl: url,
          expiresInMinutes: RESET_PASSWORD_TOKEN_EXPIRES_IN_MINUTES,
        }),
      }).then((value) => {
        if (value.provider === "resend") {
          const { result } = value;
          if (!result.success) {
            console.error(result.error);
          }
          return;
        }

        const { result } = value;
        if (!result.success) {
          console.error(result.error);
        }
      });
    },
  },
  emailVerification: {
    autoSignInAfterVerification: true,
    expiresIn: EMAIL_VERIFICATION_EXPIRES_IN_MINUTES * 60,
    sendVerificationEmail: async ({ user, url }) => {
      void sendEmail({
        to: user.email,
        subject: "Verify your email address",
        reactEmail: createElement(VerifyEmail, {
          name: user.name,
          verificationUrl: url,
          expiresInMinutes: EMAIL_VERIFICATION_EXPIRES_IN_MINUTES,
        }),
      }).then((value) => {
        if (value.provider === "resend") {
          const { result } = value;
          if (!result.success) {
            console.error(result.error);
          }
          return;
        }

        const { result } = value;
        if (!result.success) {
          console.error(result.error);
        }
      });
    },
  },
  // Make sure to keep the tanstackStartCookies plugin at the end of the array.
  plugins: [haveIBeenPwned(), tanstackStartCookies()],
});

import { drizzleAdapter } from "@better-auth/drizzle-adapter/relations-v2";
import { betterAuth } from "better-auth/minimal";
import { haveIBeenPwned } from "better-auth/plugins";
import { tanstackStartCookies } from "better-auth/tanstack-start";
import { createElement } from "react";

import { APP_NAME } from "@/config/constants";
import { env } from "@/config/env";
import { db } from "@/db";
import {
  accountTable,
  sessionTable,
  verificationTable,
} from "@/db/schema/tables/auth";
import { userTable } from "@/db/schema/tables/user";
import {
  EMAIL_VERIFICATION_EXPIRES_IN_MINUTES,
  MAX_PASSWORD_LENGTH,
  MIN_PASSWORD_LENGTH,
} from "@/features/auth/constants";
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
  },
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    minPasswordLength: MIN_PASSWORD_LENGTH,
    maxPasswordLength: MAX_PASSWORD_LENGTH,
    revokeSessionsOnPasswordReset: true,
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

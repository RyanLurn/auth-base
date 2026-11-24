import { drizzleAdapter } from "@better-auth/drizzle-adapter/relations-v2";
import { betterAuth } from "better-auth/minimal";
import { haveIBeenPwned } from "better-auth/plugins";
import { tanstackStartCookies } from "better-auth/tanstack-start";

import { env } from "@/config/env";
import { db } from "@/db";
import {
  accountTable,
  sessionTable,
  verificationTable,
} from "@/db/schema/tables/auth";
import { userTable } from "@/db/schema/tables/user";

export const authServer = betterAuth({
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
  }),
  advanced: {
    database: {
      generateId: false,
      joins: true,
    },
  },
  emailAndPassword: {
    enabled: true,
  },
  // Make sure to keep the tanstackStartCookies plugin at the end of the array.
  plugins: [haveIBeenPwned(), tanstackStartCookies()],
});

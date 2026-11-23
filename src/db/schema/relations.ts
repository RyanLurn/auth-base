import { defineRelations } from "drizzle-orm";

import {
  accountTable,
  sessionTable,
  verificationTable,
} from "@/db/schema/tables/auth";
import { userTable } from "@/db/schema/tables/user";

export const relations = defineRelations(
  {
    users: userTable,
    sessions: sessionTable,
    accounts: accountTable,
    verifications: verificationTable,
  },
  ({ many, one, users, sessions, accounts }) => ({
    users: {
      sessions: many.sessions({
        from: users.id,
        to: sessions.userId,
      }),
      accounts: many.accounts({
        from: users.id,
        to: accounts.userId,
      }),
    },
    sessions: {
      user: one.users({
        from: sessions.userId,
        to: users.id,
        optional: false,
      }),
    },
    accounts: {
      user: one.users({
        from: sessions.userId,
        to: users.id,
        optional: false,
      }),
    },
  }),
);

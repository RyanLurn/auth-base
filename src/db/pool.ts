import { Pool } from "pg";

import { env } from "@/config/env";

export const dbPool = new Pool({
  connectionString: env.POSTGRESQL_CONNECTION_STRING,
});

import { drizzle } from "drizzle-orm/node-postgres";

import { dbPool } from "@/db/pool";
import { relations } from "@/db/schema/relations";

export const db = drizzle({ client: dbPool, relations });

import { defineConfig } from "drizzle-kit";

process.loadEnvFile(".env.local");

export default defineConfig({
  schema: "./src/db/schema/tables",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.POSTGRESQL_MIGRATION_CONNECTION_STRING!,
  },
});

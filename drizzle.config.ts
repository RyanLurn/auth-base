import { defineConfig } from "drizzle-kit";

process.loadEnvFile();

export default defineConfig({
  schema: "./src/db/schema/tables",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.POSTGRESQL_CONNECTION_STRING!,
  },
});

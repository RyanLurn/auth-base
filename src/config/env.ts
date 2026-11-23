import { NonEmptyStringSchema } from "@little-nebulae/zod-schemas";
import { z } from "zod";

const EnvSchema = z.object({
  POSTGRESQL_CONNECTION_STRING: NonEmptyStringSchema,
  BETTER_AUTH_SECRETS: NonEmptyStringSchema,
  BETTER_AUTH_URL: z.url(),
});

export const env = EnvSchema.parse(process.env);

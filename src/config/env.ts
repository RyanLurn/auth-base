import { NonEmptyStringSchema } from "@little-nebulae/zod-schemas";
import { z } from "zod";

const EnvSchema = z.object({
  POSTGRESQL_CONNECTION_STRING: NonEmptyStringSchema,
});

export const env = EnvSchema.parse(process.env);

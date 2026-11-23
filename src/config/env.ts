import { NonEmptyStringSchema } from "@little-nebulae/zod-schemas";
import { z } from "zod";

function BetterAuthSecretSchema<TVersion extends number>({
  version,
}: {
  version: TVersion;
}) {
  return z
    .base64()
    .min(32)
    .transform((value) => ({ version, value }));
}

const EnvSchema = z.object({
  POSTGRESQL_CONNECTION_STRING: NonEmptyStringSchema,
  BETTER_AUTH_SECRET_VERSION_1: BetterAuthSecretSchema({ version: 1 }),
  BETTER_AUTH_URL: z.url(),
});

export const env = EnvSchema.parse(process.env);

import { NonEmptyStringSchema } from "@little-nebulae/zod-schemas";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { BASE_ERROR_CODES } from "better-auth";
import { z } from "zod";

import { RedirectSearchParamSchema } from "@/utils/schemas/redirect";

export const Route = createFileRoute(
  "/(auth)/request-password-reset/callback/",
)({
  validateSearch: z.xor([
    z.object({
      ...RedirectSearchParamSchema.shape,
      token: NonEmptyStringSchema,
    }),
    z.object({
      ...RedirectSearchParamSchema.shape,
      error: z.literal(BASE_ERROR_CODES.INVALID_TOKEN.code),
    }),
  ]),
  beforeLoad: ({ search }) => {
    if ("token" in search) {
      throw redirect({ to: "/reset-password", search });
    }
    return search;
  },
  component: RequestPasswordResetCallbackPage,
});

function RequestPasswordResetCallbackPage() {
  return <div>Hello "/(auth)/request-password-reset/callback/"!</div>;
}

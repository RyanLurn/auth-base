import { NonEmptyStringSchema } from "@little-nebulae/zod-schemas";
import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

import { RedirectSearchParamSchema } from "@/utils/schemas/redirect";

export const Route = createFileRoute("/(auth)/reset-password/")({
  validateSearch: z.object({
    ...RedirectSearchParamSchema.shape,
    token: NonEmptyStringSchema,
  }),
  component: ResetPasswordPage,
});

function ResetPasswordPage() {
  return <div>Hello "/(auth)/reset-password/"!</div>;
}

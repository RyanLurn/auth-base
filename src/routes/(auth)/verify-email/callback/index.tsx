import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

import { RedirectSearchParamSchema } from "@/utils/schemas/redirect";

export const Route = createFileRoute("/(auth)/verify-email/callback/")({
  validateSearch: z.object({
    ...RedirectSearchParamSchema.shape,
    email: z.email().optional().catch(undefined),
    error: z.string().optional().catch(undefined),
  }),
  component: VerifyEmailCallbackPage,
});

function VerifyEmailCallbackPage() {
  return <div>Hello "/(auth)/verify-email/callback/"!</div>;
}

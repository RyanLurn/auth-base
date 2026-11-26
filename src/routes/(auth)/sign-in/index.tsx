import { createFileRoute } from "@tanstack/react-router";

import { RedirectSearchParamSchema } from "@/utils/schemas/redirect";

export const Route = createFileRoute("/(auth)/sign-in/")({
  validateSearch: RedirectSearchParamSchema,
  component: SignInPage,
});

function SignInPage() {
  return <div>Hello "/(auth)/sign-in/"!</div>;
}

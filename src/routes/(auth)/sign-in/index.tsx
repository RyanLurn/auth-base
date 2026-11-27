import { createFileRoute } from "@tanstack/react-router";

import { SignInParamsSchema } from "@/features/auth/schemas";
import { useAppForm } from "@/lib/form/hooks";
import { RedirectSearchParamSchema } from "@/utils/schemas/redirect";

export const Route = createFileRoute("/(auth)/sign-in/")({
  validateSearch: RedirectSearchParamSchema,
  component: SignInPage,
});

function SignInPage() {
  const signInForm = useAppForm({
    defaultValues: {
      email: "",
      password: "",
      rememberMe: true,
    },
    validators: {
      onSubmit: SignInParamsSchema,
    },
  });

  return <div>Hello "/(auth)/sign-in/"!</div>;
}

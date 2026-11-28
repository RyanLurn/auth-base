import { NonEmptyStringSchema } from "@little-nebulae/zod-schemas";
import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

import { ConfirmPasswordSchema, PasswordSchema } from "@/features/auth/schemas";
import { useAppForm } from "@/lib/form/hooks";
import { RedirectSearchParamSchema } from "@/utils/schemas/redirect";

export const Route = createFileRoute("/(auth)/reset-password/")({
  validateSearch: z.object({
    ...RedirectSearchParamSchema.shape,
    token: NonEmptyStringSchema,
  }),
  component: ResetPasswordPage,
});

function ResetPasswordPage() {
  const resetPasswordForm = useAppForm({
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
    validators: {
      onSubmit: z
        .object({
          password: PasswordSchema,
          confirmPassword: ConfirmPasswordSchema,
        })
        .refine((arg) => arg.confirmPassword === arg.password, {
          error: "Passwords do not match.",
          path: ["confirmPassword"],
        }),
    },
  });
  return <div>Hello "/(auth)/reset-password/"!</div>;
}

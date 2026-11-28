import { NonEmptyStringSchema } from "@little-nebulae/zod-schemas";
import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

import { toast } from "@/components/ui/toast";
import { authClient } from "@/features/auth/client";
import { ConfirmPasswordSchema, PasswordSchema } from "@/features/auth/schemas";
import { useAppForm } from "@/lib/form/hooks";
import { Route as SignInRoute } from "@/routes/(auth)/sign-in";
import { RedirectSearchParamSchema } from "@/utils/schemas/redirect";

export const Route = createFileRoute("/(auth)/reset-password/")({
  validateSearch: z.object({
    ...RedirectSearchParamSchema.shape,
    token: NonEmptyStringSchema,
  }),
  component: ResetPasswordPage,
});

function ResetPasswordPage() {
  const { token, redirect } = Route.useSearch();
  const navigate = Route.useNavigate();

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
    onSubmit: async ({ value }) => {
      try {
        // Reset password operation
        const { error } = await authClient.resetPassword({
          newPassword: value.password,
          token,
        });

        // Handle success case
        if (error === null) {
          toast.add({
            type: "success",
            title: "Reset password successfully",
            description: "You can now use the new password to sign in.",
          });
          await navigate({
            to: SignInRoute.to,
            search: { redirect },
          });
          return;
        }

        // Handle error cases
        toast.add({
          type: "error",
          title: "Failed to reset password",
          description: error.message,
        });
      } catch {
        // Handle catch-all error
        toast.add({
          type: "error",
          title: "Failed to reset password",
          description:
            "Something went wrong. Please try again later or contact support.",
        });
      }
    },
  });

  return <div>Hello "/(auth)/reset-password/"!</div>;
}

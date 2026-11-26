import { EmailSchema } from "@little-nebulae/zod-schemas";
import { useSelector } from "@tanstack/react-form";
import { createFileRoute, useNavigate } from "@tanstack/react-router";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FieldGroup } from "@/components/ui/field";
import { toast } from "@/components/ui/toast";
import { authClient } from "@/features/auth/client";
import { NameSchema, SignUpParamsSchema } from "@/features/auth/schemas";
import { useAppForm } from "@/lib/form/hooks";
import { Route as VerifyEmailRoute } from "@/routes/(auth)/verify-email";
import { Route as DashboardRoute } from "@/routes/_authenticated/dashboard";
import { RedirectSearchParamSchema } from "@/utils/schemas/redirect";

export const Route = createFileRoute("/(auth)/sign-up/")({
  validateSearch: RedirectSearchParamSchema,
  component: SignUpPage,
});

function SignUpPage() {
  const { redirect } = Route.useSearch();
  const navigate = useNavigate({ from: "/sign-up/" });

  const signUpForm = useAppForm({
    formId: "sign-up-form",
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    validators: {
      onSubmit: SignUpParamsSchema,
    },
    onSubmit: async ({ value }) => {
      try {
        // The SignUpParamsSchema transforms name and email.
        // However, TanStack Form doesn't use the output of validators for the value.
        // So, we need to parse it again here to get the transformed name and email.
        const { name, email, password } = SignUpParamsSchema.parse(value);

        // Sign-up operation
        const { data, error } = await authClient.signUp.email({
          name,
          email,
          password,
          callbackURL: redirect ?? DashboardRoute.to,
        });

        // Handle success case
        if (data) {
          toast.add({
            type: "success",
            title: "Signed up successfully",
          });
          await navigate({ to: VerifyEmailRoute.to });
          return;
        }

        // Handle error cases
        toast.add({
          type: "error",
          title: "Failed to sign up",
          description: error.message,
        });
        return;
      } catch {
        // Handle catch-all error
        toast.add({
          type: "error",
          title: "Failed to sign up",
          description:
            "Something went wrong. Please try again later or contact support.",
        });
        return;
      }
    },
  });

  const isSubmitting = useSelector(
    signUpForm.store,
    (state) => state.isSubmitting,
  );

  return (
    <div className="flex size-full flex-col items-center justify-center">
      <Card className="w-full sm:max-w-sm">
        <CardHeader>
          <CardTitle className="text-xl">Sign up</CardTitle>
          <CardDescription>
            Enter your information below to create an account.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            id={signUpForm.formId}
            onSubmit={(e) => {
              e.preventDefault();
              void signUpForm.handleSubmit();
            }}
          >
            <FieldGroup>
              {/* Name field */}
              <signUpForm.AppField
                name="name"
                validators={{
                  onChange: NameSchema,
                }}
              >
                {({ TextField }) => (
                  <TextField
                    placeholder="Your Name"
                    disabled={isSubmitting}
                    label="Name"
                    type="text"
                  />
                )}
              </signUpForm.AppField>
              {/* Email field */}
              <signUpForm.AppField
                name="email"
                validators={{
                  onChange: EmailSchema,
                }}
              >
                {({ TextField }) => (
                  <TextField
                    placeholder="youremail@example.com"
                    disabled={isSubmitting}
                    label="Email"
                    type="email"
                  />
                )}
              </signUpForm.AppField>
            </FieldGroup>
          </form>
        </CardContent>
        <CardFooter></CardFooter>
      </Card>
    </div>
  );
}

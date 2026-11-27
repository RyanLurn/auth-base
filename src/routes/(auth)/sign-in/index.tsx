import { HTTP_CLIENT_ERROR_RESPONSE_STATUS_ENUM } from "@little-nebulae/http";
import { EmailSchema } from "@little-nebulae/zod-schemas";
import { useSelector } from "@tanstack/react-form";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { BASE_ERROR_CODES } from "better-auth";

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
import { MIN_PASSWORD_LENGTH } from "@/features/auth/constants";
import {
  PasswordSchema,
  RememberMeSchema,
  SignInParamsSchema,
} from "@/features/auth/schemas";
import { useAppForm } from "@/lib/form/hooks";
import { Route as VerifyEmailRoute } from "@/routes/(auth)/verify-email";
import { Route as DashboardRoute } from "@/routes/_authenticated/dashboard";
import { RedirectSearchParamSchema } from "@/utils/schemas/redirect";

export const Route = createFileRoute("/(auth)/sign-in/")({
  validateSearch: RedirectSearchParamSchema,
  component: SignInPage,
});

function SignInPage() {
  const { redirect } = Route.useSearch();
  const navigate = useNavigate({ from: "/sign-up/" });

  const signInForm = useAppForm({
    formId: "sign-in-form",
    defaultValues: {
      email: "",
      password: "",
      rememberMe: true,
    },
    validators: {
      onSubmit: SignInParamsSchema,
    },
    onSubmit: async ({ value, formApi }) => {
      try {
        // The SignInParamsSchema transforms email.
        // However, TanStack Form doesn't use the output of validators for the value.
        // So, we need to parse it again here to get the transformed email.
        const { email, password, rememberMe } = SignInParamsSchema.parse(value);

        // Sign in operation
        const { data, error } = await authClient.signIn.email({
          email,
          password,
          rememberMe,
          callbackURL: redirect ?? DashboardRoute.to,
        });

        // Handle success case
        if (data) {
          toast.add({
            type: "success",
            title: "Signed in successfully",
            description: `Welcome back, ${data.user.name}.`,
          });
          return;
        }

        // Handle error cases
        // Invalid credentials case
        if (error.code === BASE_ERROR_CODES.INVALID_EMAIL_OR_PASSWORD.code) {
          formApi.setFieldMeta("email", (prev) => ({
            ...prev,
            errorMap: {
              onServer: [
                {
                  message:
                    error.message ??
                    BASE_ERROR_CODES.INVALID_EMAIL_OR_PASSWORD.message,
                },
              ],
            },
          }));
          formApi.setFieldMeta("password", (prev) => ({
            ...prev,
            errorMap: {
              onServer: [
                {
                  message:
                    error.message ??
                    BASE_ERROR_CODES.INVALID_EMAIL_OR_PASSWORD.message,
                },
              ],
            },
          }));
          return;
        }
        // Email isn't verified case
        if (
          error.status === HTTP_CLIENT_ERROR_RESPONSE_STATUS_ENUM.FORBIDDEN.CODE
        ) {
          await navigate({
            to: VerifyEmailRoute.to,
            search: { reason: "sign-in", email, redirect },
          });
          return;
        }
        // Other cases
        toast.add({
          type: "error",
          title: "Failed to sign in",
          description: error.message,
        });
        return;
      } catch {
        // Handle catch-all error
        toast.add({
          type: "error",
          title: "Failed to sign in",
          description:
            "Something went wrong. Please try again later or contact support.",
        });
        return;
      }
    },
  });

  const isSubmitting = useSelector(
    signInForm.store,
    (state) => state.isSubmitting,
  );

  return (
    <div className="flex size-full flex-col items-center justify-center">
      <Card className="w-full sm:max-w-sm">
        <CardHeader>
          <CardTitle className="text-xl">Sign in</CardTitle>
          <CardDescription>
            Enter your credentials below to sign in.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            id={signInForm.formId}
            onSubmit={(e) => {
              e.preventDefault();
              void signInForm.handleSubmit();
            }}
          >
            <FieldGroup>
              {/* Email field */}
              <signInForm.AppField
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
              </signInForm.AppField>
              {/* Password field */}
              <signInForm.AppField
                name="password"
                validators={{
                  onChange: PasswordSchema,
                }}
              >
                {({ TextField }) => (
                  <TextField
                    placeholder={"*".repeat(MIN_PASSWORD_LENGTH)}
                    disabled={isSubmitting}
                    label="Password"
                    type="password"
                  />
                )}
              </signInForm.AppField>
              {/* Remember me checkbox */}
              <signInForm.AppField
                name="rememberMe"
                validators={{
                  onChange: RememberMeSchema,
                }}
              >
                {({ CheckField }) => (
                  <CheckField
                    disabled={isSubmitting}
                    className="rounded-sm"
                    label="Remember me"
                  />
                )}
              </signInForm.AppField>
            </FieldGroup>
          </form>
        </CardContent>
        <CardFooter className="flex-col gap-y-2">
          {/* Submit button */}
          <signInForm.AppForm>
            <signInForm.SubmitButton
              submittingText="Signing in..."
              submitText="Sign in"
              className="w-full"
            />
          </signInForm.AppForm>
        </CardFooter>
      </Card>
    </div>
  );
}

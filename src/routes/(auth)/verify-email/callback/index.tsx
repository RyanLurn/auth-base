import type { LucideIcon } from "lucide-react";

import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import { BASE_ERROR_CODES } from "better-auth";
import { MailX, TriangleAlert, UserX } from "lucide-react";
import { z } from "zod";

import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Route as DashboardRoute } from "@/routes/_authenticated/dashboard";
import { RedirectSearchParamSchema } from "@/utils/schemas/redirect";

export const Route = createFileRoute("/(auth)/verify-email/callback/")({
  validateSearch: z.object({
    ...RedirectSearchParamSchema.shape,
    email: z.email().optional().catch(undefined),
    error: z.string().optional().catch(undefined),
  }),
  beforeLoad: ({ search }) => {
    if (!search.error) {
      throw redirect({ to: search.redirect ?? DashboardRoute.to });
    }
  },
  component: VerifyEmailCallbackPage,
});

type ErrorCopy = {
  icon: LucideIcon;
  title: string;
  description: string;
  action: "resend" | "sign-up";
};

const errorCopy: Record<string, ErrorCopy> = {
  [BASE_ERROR_CODES.TOKEN_EXPIRED.code]: {
    icon: MailX,
    title: "This link has expired",
    description:
      "Verification links are only valid for a short time. Request a new one to continue.",
    action: "resend",
  },
  [BASE_ERROR_CODES.INVALID_TOKEN.code]: {
    icon: MailX,
    title: "This link isn't valid",
    description:
      "The link may be incomplete or have been replaced by a newer email. Request a new one to continue.",
    action: "resend",
  },
  [BASE_ERROR_CODES.USER_NOT_FOUND.code]: {
    icon: UserX,
    title: "We couldn't find your account",
    description:
      "The account for this link no longer exists. Create a new account to continue.",
    action: "sign-up",
  },
};

const fallbackCopy: ErrorCopy = {
  icon: TriangleAlert,
  title: "We couldn't verify your email",
  description:
    "Something went wrong while verifying your email. Request a new link to try again.",
  action: "resend",
};

function VerifyEmailCallbackPage() {
  const { email, error, redirect } = Route.useSearch();
  const {
    icon: Icon,
    title,
    description,
    action,
  } = (error ? errorCopy[error] : undefined) ?? fallbackCopy;

  return (
    <main className="flex size-full items-center justify-center p-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="mb-2 flex size-12 items-center justify-center justify-self-center rounded-full bg-muted text-muted-foreground">
            <Icon className="size-6" aria-hidden="true" />
          </div>
          <CardTitle className="text-xl">{title}</CardTitle>
          <CardDescription className="text-balance">
            {description}
          </CardDescription>
        </CardHeader>

        <CardFooter className="flex-col gap-2">
          {action === "sign-up" ? (
            <Link
              to="/sign-up"
              search={{ redirect }}
              className={buttonVariants({ className: "w-full" })}
            >
              Create an account
            </Link>
          ) : email ? (
            <Link
              to="/verify-email"
              search={{ email, reason: "sign-in", redirect }}
              className={buttonVariants({ className: "w-full" })}
            >
              Request a new link
            </Link>
          ) : null}

          <Link
            to="/sign-in"
            search={{ redirect }}
            className={buttonVariants({ variant: "link", size: "sm" })}
          >
            Back to sign in
          </Link>
        </CardFooter>
      </Card>
    </main>
  );
}

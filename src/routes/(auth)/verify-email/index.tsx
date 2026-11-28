import { createFileRoute, Link } from "@tanstack/react-router";
import { MailCheck, MailWarning } from "lucide-react";
import { useEffect, useState } from "react";
import { z } from "zod";

import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "@/components/ui/toast";
import { authClient } from "@/features/auth/client";
import { getCallbackUrl } from "@/features/auth/utils";
import { RedirectSearchParamSchema } from "@/utils/schemas/redirect";

const RESEND_COOLDOWN_SECONDS = 30;

export const Route = createFileRoute("/(auth)/verify-email/")({
  validateSearch: z.object({
    ...RedirectSearchParamSchema.shape,
    email: z.email().optional().catch(undefined),
    reason: z.enum(["sign-up", "sign-in"]).catch("sign-up"),
  }),
  component: VerifyEmailPage,
});

const copy = {
  "sign-up": {
    icon: MailCheck,
    title: "Check your email",
    description: (email: string | undefined) =>
      email
        ? `We sent a verification link to ${email}. Open it to finish setting up your account.`
        : "We sent you a verification link. Open it to finish setting up your account.",
  },
  "sign-in": {
    icon: MailWarning,
    title: "Verify your email to continue",
    description: (email: string | undefined) =>
      email
        ? `${email} hasn't been verified yet. Open the link in your verification email, or request a new one below.`
        : "Your email hasn't been verified yet. Open the link in your verification email, or request a new one.",
  },
} as const;

function VerifyEmailPage() {
  const { email, reason, redirect } = Route.useSearch();
  const { icon: Icon, title, description } = copy[reason];

  // After sign-up an email was just sent, so start the cooldown immediately.
  const [cooldown, setCooldown] = useState(
    reason === "sign-up" ? RESEND_COOLDOWN_SECONDS : 0,
  );
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timeout = setTimeout(() => setCooldown((value) => value - 1), 1000);
    return () => clearTimeout(timeout);
  }, [cooldown]);

  async function resend() {
    if (!email) return;

    setIsSending(true);
    try {
      const { error } = await authClient.sendVerificationEmail({
        email,
        callbackURL: getCallbackUrl({ email, redirect }),
      });

      // Handle success case
      if (error === null) {
        toast.add({
          type: "success",
          title: "Resend successfully",
        });
        setCooldown(RESEND_COOLDOWN_SECONDS);
        return;
      }

      // Handle error case
      toast.add({
        type: "error",
        title: "Failed to resend",
        description: error.message,
      });
    } catch {
      toast.add({
        type: "error",
        title: "Failed to resend",
        description:
          "Something went wrong. Please try again later or contact support.",
      });
    } finally {
      setIsSending(false);
    }
  }

  return (
    <main className="flex size-full items-center justify-center p-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="mb-2 flex size-12 items-center justify-center justify-self-center rounded-full bg-muted text-muted-foreground">
            <Icon className="size-6" aria-hidden="true" />
          </div>
          <CardTitle className="text-xl">{title}</CardTitle>
          <CardDescription className="text-balance">
            {description(email)}
          </CardDescription>
        </CardHeader>

        {email ? (
          <CardContent className="flex flex-col items-center gap-3">
            <Button
              variant="outline"
              className="w-full"
              disabled={isSending || cooldown > 0}
              onClick={resend}
            >
              {isSending && <Spinner />}
              {cooldown > 0
                ? `Resend email in ${cooldown}s`
                : "Resend verification email"}
            </Button>
            <p className="text-sm text-muted-foreground">
              Can't find it? Check your spam folder.
            </p>
          </CardContent>
        ) : null}

        <CardFooter className="justify-center">
          <Link
            to={reason === "sign-in" ? "/sign-in" : "/sign-up"}
            search={{ redirect }}
            className={buttonVariants({ variant: "link", size: "sm" })}
          >
            Back to {reason} page
          </Link>
        </CardFooter>
      </Card>
    </main>
  );
}

import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(auth)/verify-email/")({
  component: VerifyEmailPage,
});

function VerifyEmailPage() {
  return (
    <div>
      We sent you a verification link. Open it to finish setting up your
      account.
    </div>
  );
}

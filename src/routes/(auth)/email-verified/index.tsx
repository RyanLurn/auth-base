import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(auth)/email-verified/")({
  component: EmailVerifiedPage,
});

function EmailVerifiedPage() {
  return <div>Your email has been verified.</div>;
}

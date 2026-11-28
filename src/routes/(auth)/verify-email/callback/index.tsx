import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(auth)/verify-email/callback/")({
  component: VerifyEmailCallbackPage,
});

function VerifyEmailCallbackPage() {
  return <div>Hello "/(auth)/verify-email/callback/"!</div>;
}

import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute(
  "/(auth)/request-password-reset/callback/",
)({
  component: RequestPasswordResetCallbackPage,
});

function RequestPasswordResetCallbackPage() {
  return <div>Hello "/(auth)/request-password-reset/callback/"!</div>;
}

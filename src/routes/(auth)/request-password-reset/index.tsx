import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(auth)/request-password-reset/")({
  component: RequestPasswordResetPage,
});

function RequestPasswordResetPage() {
  return <div>Hello "/(auth)/request-password-reset/"!</div>;
}

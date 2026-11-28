import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(auth)/reset-password/request/")({
  component: ResetPasswordRequestPage,
});

function ResetPasswordRequestPage() {
  return <div>Hello "/(auth)/reset-password/request/"!</div>;
}

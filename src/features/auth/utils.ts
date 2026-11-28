import { Route as VerifyEmailCallbackRoute } from "@/routes/(auth)/verify-email/callback";
import { Route as DashboardRoute } from "@/routes/_authenticated/dashboard";

export function getCallbackUrl({
  email,
  redirect = DashboardRoute.to,
}: {
  email: string;
  redirect?: string | undefined;
}) {
  return `${VerifyEmailCallbackRoute.to}?${new URLSearchParams({ email, redirect })}`;
}

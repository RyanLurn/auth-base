import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

import { getAuthUser } from "@/features/auth/operations/get-user";

export const Route = createFileRoute("/_authenticated")({
  beforeLoad: async () => {
    const getUserResult = await getAuthUser();
    if (getUserResult.success) {
      return getUserResult.data;
    }

    const getUserError = getUserResult.error;
    if (getUserError.code === "UNAUTHENTICATED_ERROR") {
      throw redirect({ to: "/sign-in" });
    }
    throw getUserError;
  },
  component: AuthenticatedLayout,
});

function AuthenticatedLayout() {
  return <Outlet />;
}

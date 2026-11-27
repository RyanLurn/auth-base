import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

import { getAuthUser } from "@/features/auth/operations/get-user";
import { defaultFlatError } from "@/lib/result";
import { superjsonCodec } from "@/lib/superjson";

export const Route = createFileRoute("/_authenticated")({
  beforeLoad: async ({ location }) => {
    const getUserResult = await getAuthUser();
    if (getUserResult.success) {
      const decodeResult = superjsonCodec.decode({
        output: getUserResult.data,
      });
      if (decodeResult.success) {
        return { user: decodeResult.data };
      }
      throw defaultFlatError;
    }

    const getUserError = getUserResult.error;
    if (getUserError.code === "UNAUTHENTICATED_ERROR") {
      throw redirect({
        to: "/sign-in",
        search: { redirect: location.pathname },
      });
    }
    throw getUserError;
  },
  component: AuthenticatedLayout,
});

function AuthenticatedLayout() {
  return <Outlet />;
}

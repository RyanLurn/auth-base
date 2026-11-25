import { unwrapResult } from "@little-nebulae/result";
import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

import { getAuthUser } from "@/features/auth/operations/get-user";
import { superjsonCodec } from "@/lib/superjson";

export const Route = createFileRoute("/_authenticated")({
  beforeLoad: async () => {
    const getUserResult = await getAuthUser();
    if (getUserResult.success) {
      const user = unwrapResult(
        superjsonCodec.decode({ output: getUserResult.data }),
      );
      return { user };
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

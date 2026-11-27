import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { z } from "zod";

import { getAuthUser } from "@/features/auth/operations/get-user";
import { defaultFlatError } from "@/lib/result";
import { superjsonCodec } from "@/lib/superjson";

export const Route = createFileRoute("/_authenticated")({
  validateSearch: z.object({
    error: z.string().optional().catch(undefined),
  }),
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

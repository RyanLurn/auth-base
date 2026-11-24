import { createFileRoute } from "@tanstack/react-router";

import { authServer } from "@/features/auth/server";

export const Route = createFileRoute("/api/auth/$")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        return await authServer.handler(request);
      },
      POST: async ({ request }) => {
        return await authServer.handler(request);
      },
    },
  },
});

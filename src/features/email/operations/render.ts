import type { ReactNode } from "react";

import { createServerOnlyFn } from "@tanstack/react-start";
import { render } from "react-email";

export const renderEmail = createServerOnlyFn(
  async ({ node, pretty = false }: { node: ReactNode; pretty?: boolean }) => {
    return await render(node, { pretty });
  },
);

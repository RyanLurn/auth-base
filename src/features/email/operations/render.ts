import type { ReactNode } from "react";

import { createServerOnlyFn } from "@tanstack/react-start";
import { render } from "react-email";

type RenderEmailParams =
  | { format: "html"; node: ReactNode; pretty?: boolean }
  | { format: "plain-text"; node: ReactNode };

export const renderEmail = createServerOnlyFn(
  async (params: RenderEmailParams) => {
    return await render(
      params.node,
      params.format === "html"
        ? { pretty: params.pretty ?? false }
        : { plainText: true },
    );
  },
);

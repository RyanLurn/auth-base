import type { ReactNode } from "react";

import { Text } from "react-email";

/** Body copy. `muted` mirrors shadcn's `text-muted-foreground` (CardDescription). */
export function EmailText({
  children,
  muted = false,
}: {
  children: ReactNode;
  muted?: boolean;
}) {
  return (
    <Text
      className={
        muted
          ? "dark:text-dark-muted-foreground m-0 mt-3 text-sm leading-6 text-muted-foreground"
          : "dark:text-dark-foreground m-0 mt-4 text-sm leading-6 text-foreground"
      }
    >
      {children}
    </Text>
  );
}

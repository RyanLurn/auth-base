import type { ReactNode } from "react";

import { Heading } from "react-email";

export function EmailHeading({ children }: { children: ReactNode }) {
  return (
    <Heading
      as="h1"
      className="dark:text-dark-foreground m-0 text-xl leading-7 font-semibold text-foreground"
    >
      {children}
    </Heading>
  );
}

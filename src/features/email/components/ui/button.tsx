import type { ReactNode } from "react";

import { Button, Section } from "react-email";

/** Button (variant="default"). */
export function EmailButton({
  href,
  children,
}: {
  href: string;
  children: ReactNode;
}) {
  return (
    <Section className="mt-6">
      <Button
        href={href}
        className="dark:bg-dark-primary dark:text-dark-primary-foreground box-border inline-block rounded-lg bg-primary px-4 py-2.5 text-center text-sm leading-5 font-medium text-primary-foreground no-underline"
      >
        {children}
      </Button>
    </Section>
  );
}

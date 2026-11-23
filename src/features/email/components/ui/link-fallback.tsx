import { Link, Text } from "react-email";

/** Fallback for clients that block buttons: the raw URL in a muted, wrapping style. */
export function EmailLinkFallback({ href }: { href: string }) {
  return (
    <>
      <Text className="dark:text-dark-muted-foreground m-0 text-xs leading-5 text-muted-foreground">
        Button not working? Copy and paste this link into your browser:
      </Text>
      <Text className="m-0 mt-1 text-xs leading-5 break-all">
        <Link
          href={href}
          className="dark:text-dark-muted-foreground text-muted-foreground underline"
        >
          {href}
        </Link>
      </Text>
    </>
  );
}

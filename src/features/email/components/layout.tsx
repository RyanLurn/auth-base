import type { ComponentProps, ReactNode } from "react";

import {
  Body,
  Column,
  Container,
  Font,
  Head,
  Html,
  Preview,
  Row,
  Section,
  Tailwind,
  Text,
  pixelBasedPreset,
} from "react-email";

import { APP_NAME } from "@/config/constants";

/**
 * shadcn/ui tokens, pre-resolved to sRGB hex.
 *
 * Email clients don't support `oklch()`, `color-mix()` or CSS variables, so we can't
 * import the app's CSS. These values are the exact sRGB equivalents of the tokens in
 * your `:root` / `.dark` blocks. Dark tokens are prefixed `dark-` and used with the
 * `dark:` variant (prefers-color-scheme).
 */
const config = {
  presets: [pixelBasedPreset], // rem -> px, Outlook-safe
  theme: {
    extend: {
      colors: {
        // :root
        background: "#ffffff", // oklch(1 0 0)
        foreground: "#0a0a0a", // oklch(0.145 0 0)
        card: "#ffffff",
        primary: "#171717", // oklch(0.205 0 0)
        "primary-foreground": "#fafafa", // oklch(0.985 0 0)
        muted: "#f5f5f5", // oklch(0.97 0 0)
        "muted-foreground": "#737373", // oklch(0.556 0 0)
        border: "#e5e5e5", // oklch(0.922 0 0)
        destructive: "#e7000b", // oklch(0.577 0.245 27.325)

        // .dark
        "dark-background": "#0a0a0a",
        "dark-foreground": "#fafafa",
        "dark-card": "#171717", // oklch(0.205 0 0)
        "dark-primary": "#e5e5e5", // oklch(0.922 0 0)
        "dark-primary-foreground": "#171717",
        "dark-muted": "#262626", // oklch(0.269 0 0)
        "dark-muted-foreground": "#a1a1a1", // oklch(0.708 0 0)
        "dark-border": "#2e2e2e", // oklch(1 0 0 / 10%) flattened onto the card
        "dark-destructive": "#ff6467", // oklch(0.704 0.191 22.216)
      },
      // --radius: 0.625rem (10px)
      borderRadius: {
        sm: "6px",
        md: "8px",
        lg: "10px",
        xl: "14px",
      },
      fontFamily: {
        sans: [
          "Geist",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "Helvetica",
          "Arial",
          "sans-serif",
        ],
        mono: [
          "Geist Mono",
          "ui-monospace",
          "SFMono-Regular",
          "Menlo",
          "Consolas",
          "monospace",
        ],
      },
    },
  },
} satisfies ComponentProps<typeof Tailwind>["config"];

type EmailLayoutProps = {
  /** Inbox preview text. */
  preview: string;
  children: ReactNode;
  /** Small print under the card (e.g. "Didn't request this?"). */
  footer?: ReactNode;
};

export function EmailLayout({ preview, children, footer }: EmailLayoutProps) {
  return (
    <Html lang="en" dir="ltr">
      <Tailwind config={config}>
        <Head>
          <meta name="color-scheme" content="light dark" />
          <meta name="supported-color-schemes" content="light dark" />
          {/* Only honoured by Apple Mail & a few others. Falls back to the system stack. */}
          <Font
            fontFamily="Geist"
            fallbackFontFamily={["Helvetica", "Arial", "sans-serif"]}
            webFont={{
              url: "https://cdn.jsdelivr.net/fontsource/fonts/geist:vf@latest/latin-wght-normal.woff2",
              format: "woff2",
            }}
            fontWeight="100 900"
            fontStyle="normal"
          />
        </Head>
        <Preview>{preview}</Preview>

        <Body className="dark:bg-dark-background m-0 bg-muted p-0 font-sans">
          <Container className="mx-auto w-full max-w-[480px] px-4 py-10">
            <Text className="dark:text-dark-foreground m-0 mb-6 px-1 text-base leading-6 font-semibold text-foreground">
              {APP_NAME}
            </Text>

            {/* Card: rounded-xl border bg-card. Padding lives on the <td> so Outlook respects it. */}
            <Section className="dark:border-dark-border dark:bg-dark-card rounded-xl border border-solid border-border bg-card">
              <Row>
                <Column className="p-8">{children}</Column>
              </Row>
            </Section>

            {footer ? (
              <Text className="dark:text-dark-muted-foreground m-0 mt-6 px-1 text-xs leading-5 text-muted-foreground">
                {footer}
              </Text>
            ) : null}
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}

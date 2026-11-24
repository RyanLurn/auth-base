import type { ReactElement } from "react";

import { createServerOnlyFn } from "@tanstack/react-start";
import { toPlainText } from "react-email";

import type { SendEmailOptions } from "@/features/email/types";

import { env } from "@/config/env.server";
import { renderEmail } from "@/features/email/operations/render";

interface SendEmailParams extends Pick<SendEmailOptions, "to" | "subject"> {
  reactEmail: ReactElement;
}

export const sendEmail = createServerOnlyFn(
  async ({ to, subject, reactEmail }: SendEmailParams) => {
    const html = await renderEmail({ node: reactEmail });
    const text = toPlainText(html);

    const sendOptions = {
      from: env.EMAIL_FROM,
      to,
      subject,
      html,
      text,
    } satisfies SendEmailOptions;

    if (import.meta.env.DEV) {
      const { sendWithEthereal } =
        await import("@/features/email/providers/ethereal");
      const etherealResult = await sendWithEthereal(sendOptions);
      return { provider: "ethereal" as const, result: etherealResult };
    }

    const { sendWithResend } =
      await import("@/features/email/providers/resend");
    const resendResult = await sendWithResend(sendOptions);
    return { provider: "resend" as const, result: resendResult };
  },
);

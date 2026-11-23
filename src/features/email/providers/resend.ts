import { createServerOnlyFn } from "@tanstack/react-start";
import { Resend } from "resend";

import type { SendEmailOptions } from "@/features/email/types";

import { env } from "@/config/env";

const resendClient = new Resend(env.RESEND_API_KEY);

export const sendWithResend = createServerOnlyFn(
  async ({ from, to, subject, html, text }: SendEmailOptions) => {
    return await resendClient.emails.send({
      from,
      to,
      subject,
      html,
      text,
    });
  },
);

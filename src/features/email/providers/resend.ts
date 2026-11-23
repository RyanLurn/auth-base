import { composeErrorMessage, UnexpectedError } from "@little-nebulae/error";
import { produceAsyncResult } from "@little-nebulae/result";
import { createServerOnlyFn } from "@tanstack/react-start";
import { Resend } from "resend";

import type { SendEmailOptions } from "@/features/email/types";

import { env } from "@/config/env";

const resendClient = new Resend(env.RESEND_API_KEY);

export const sendWithResend = createServerOnlyFn(
  async ({ from, to, subject, html, text }: SendEmailOptions) => {
    return produceAsyncResult({
      tryFn: async () => {
        const { data, error } = await resendClient.emails.send({
          from,
          to,
          subject,
          html,
          text,
        });
        if (error) {
          throw error;
        }
        return data;
      },
      catchFn: (error) =>
        new UnexpectedError({
          message: composeErrorMessage({
            operation: "send email with Resend",
          }),
          cause: error,
          meta: null,
        }),
    });
  },
);

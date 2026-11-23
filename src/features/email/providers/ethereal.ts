import type {
  SMTPSentMessageInfo,
  SMTPTransportOptions,
  Transporter,
} from "nodemailer";

import { composeErrorMessage, UnexpectedError } from "@little-nebulae/error";
import { produceAsyncResult } from "@little-nebulae/result";
import { createServerOnlyFn } from "@tanstack/react-start";
import nodemailer from "nodemailer";

import type { SendEmailOptions } from "@/features/email/types";

import { env } from "@/config/env";

let transporterPromise:
  | Promise<Transporter<SMTPSentMessageInfo, SMTPTransportOptions>>
  | undefined;

async function createTransporter() {
  // Optional: pin one inbox across dev-server restarts.
  if (env.ETHEREAL_USER && env.ETHEREAL_PASS) {
    return nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      secure: false,
      auth: { user: env.ETHEREAL_USER, pass: env.ETHEREAL_PASS },
    });
  }

  // Otherwise Nodemailer generates a throwaway account (cached per process).
  const account = await nodemailer.createTestAccount();
  console.info(
    [
      "[email] Created a temporary Ethereal inbox. Log in at https://ethereal.email to view it:",
      `  user: ${account.user}`,
      `  pass: ${account.pass}`,
      "  Add these as ETHEREAL_USER / ETHEREAL_PASS in .env.local to keep the same inbox between restarts.",
    ].join("\n"),
  );

  return nodemailer.createTransport({
    host: account.smtp.host,
    port: account.smtp.port,
    secure: account.smtp.secure,
    auth: { user: account.user, pass: account.pass },
  });
}

function getTransporter() {
  transporterPromise ??= createTransporter().catch((error) => {
    transporterPromise = undefined; // don't cache a failure
    throw error;
  });
  return transporterPromise;
}

export const sendWithEthereal = createServerOnlyFn(
  async ({ from, to, subject, html, text }: SendEmailOptions) => {
    return produceAsyncResult({
      tryFn: async () => {
        const transporter = await getTransporter();
        const info = await transporter.sendMail({
          from,
          to,
          subject,
          html,
          text,
        });

        const previewUrl = nodemailer.getTestMessageUrl(info);
        console.info(
          `[email] "${subject}" -> ${to}\n  Preview: ${previewUrl || "n/a"}`,
        );

        return { previewUrl, ...info };
      },
      catchFn: (error) =>
        new UnexpectedError({
          message: composeErrorMessage({
            operation: "send email with Ethereal",
          }),
          cause: error,
          meta: null,
        }),
    });
  },
);

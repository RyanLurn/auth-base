import { APP_NAME } from "@/config/constants";
import { EMAIL_VERIFICATION_EXPIRES_IN_MINUTES } from "@/features/auth/constants";
import { EmailLayout } from "@/features/email/components/layout";
import { EmailButton } from "@/features/email/components/ui/button";
import { EmailHeading } from "@/features/email/components/ui/heading";
import { EmailLinkFallback } from "@/features/email/components/ui/link-fallback";
import { EmailSeparator } from "@/features/email/components/ui/separator";
import { EmailText } from "@/features/email/components/ui/text";

type VerifyEmailProps = {
  name?: string;
  verificationUrl: string;
  expiresInMinutes: number;
};

export default function VerifyEmail({
  name,
  verificationUrl,
  expiresInMinutes,
}: VerifyEmailProps) {
  return (
    <EmailLayout
      preview={`Verify your email address for ${APP_NAME}`}
      footer="If you didn't create an account, you can safely ignore this email."
    >
      <EmailHeading>Verify your email address</EmailHeading>
      <EmailText muted>
        {name ? `Hi ${name}, thanks` : "Thanks"} for signing up for {APP_NAME}.
        Confirm your email address to finish setting up your account.
      </EmailText>
      <EmailButton href={verificationUrl}>Verify email</EmailButton>
      <EmailText muted>
        This link expires in {expiresInMinutes} minutes.
      </EmailText>
      <EmailSeparator />
      <EmailLinkFallback href={verificationUrl} />
    </EmailLayout>
  );
}

VerifyEmail.PreviewProps = {
  name: "Ada",
  verificationUrl: "https://example.com/api/auth/verify-email?token=abc123",
  expiresInMinutes: EMAIL_VERIFICATION_EXPIRES_IN_MINUTES,
} satisfies VerifyEmailProps;

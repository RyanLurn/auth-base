import { APP_NAME } from "@/config/constants";
import { RESET_PASSWORD_TOKEN_EXPIRES_IN_MINUTES } from "@/features/auth/constants";
import { EmailLayout } from "@/features/email/components/layout";
import { EmailButton } from "@/features/email/components/ui/button";
import { EmailHeading } from "@/features/email/components/ui/heading";
import { EmailLinkFallback } from "@/features/email/components/ui/link-fallback";
import { EmailSeparator } from "@/features/email/components/ui/separator";
import { EmailText } from "@/features/email/components/ui/text";

type ResetPasswordProps = {
  name?: string;
  resetUrl: string;
  expiresInMinutes: number;
};

export default function ResetPassword({
  name,
  resetUrl,
  expiresInMinutes,
}: ResetPasswordProps) {
  return (
    <EmailLayout
      preview={`Reset your ${APP_NAME} password`}
      footer="If you didn't request a password reset, you can ignore this email. Your password won't change."
    >
      <EmailHeading>Reset your password</EmailHeading>
      <EmailText muted>
        {name ? `Hi ${name}, we` : "We"} received a request to reset the
        password for your {APP_NAME} account. Choose a new one using the button
        below.
      </EmailText>
      <EmailButton href={resetUrl}>Reset password</EmailButton>
      <EmailText muted>
        This link expires in {expiresInMinutes} minutes and can only be used
        once.
      </EmailText>
      <EmailSeparator />
      <EmailLinkFallback href={resetUrl} />
    </EmailLayout>
  );
}

ResetPassword.PreviewProps = {
  name: "Ada",
  resetUrl: "https://example.com/reset-password?token=abc123",
  expiresInMinutes: RESET_PASSWORD_TOKEN_EXPIRES_IN_MINUTES,
} satisfies ResetPasswordProps;

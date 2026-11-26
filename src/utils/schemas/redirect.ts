import { z } from "zod";

const BASE = "http://internal.invalid";

export const SafeRedirectSchema = z.string().refine((value) => {
  // Must be a path, not protocol-relative ("//evil.com")
  if (!value.startsWith("/") || value.startsWith("//")) return false;

  try {
    // The URL parser normalizes tricks browsers also normalize
    // (backslashes, tabs/newlines like "/\t/evil.com"). If the
    // resolved origin changes, it's not a same-origin path.
    return new URL(value, BASE).origin === BASE;
  } catch {
    return false;
  }
}, "Invalid redirect URL");

export const RedirectSearchParamSchema = z.object({
  redirect: SafeRedirectSchema.optional().catch(undefined),
});

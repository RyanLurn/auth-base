import type { FlatError, UnexpectedErrorCode } from "@little-nebulae/error";

import { UNEXPECTED_ERROR_CODE } from "@little-nebulae/error";
import { createJsonFailure } from "@little-nebulae/result";

export type DefaultFlatError = FlatError<UnexpectedErrorCode>;
export const defaultJsonFailure = createJsonFailure({
  code: UNEXPECTED_ERROR_CODE,
  message: "Something went wrong. Please try again later or contact support.",
  meta: null,
} satisfies DefaultFlatError);

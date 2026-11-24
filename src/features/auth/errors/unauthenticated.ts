import type { BaseErrorMeta } from "@little-nebulae/error";

import { BaseError } from "@little-nebulae/error";

import { UNAUTHENTICATED_ERROR_CODE } from "@/features/auth/constants";

export class UnauthenticatedError<
  TMeta extends BaseErrorMeta = null,
> extends BaseError<typeof UNAUTHENTICATED_ERROR_CODE, "Empty session", TMeta> {
  readonly name = "UnauthenticatedError";
  readonly code = UNAUTHENTICATED_ERROR_CODE;

  constructor({ message, meta }: { message: string; meta: TMeta }) {
    super({ message, cause: "Empty session", meta });
  }
}

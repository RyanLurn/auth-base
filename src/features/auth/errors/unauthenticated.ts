import { BaseError } from "@little-nebulae/error";

import { UNAUTHENTICATED_ERROR_CODE } from "@/features/auth/constants";

export type UnauthenticatedErrorCode = typeof UNAUTHENTICATED_ERROR_CODE;

export type UnauthenticatedErrorMeta = {
  hasSessionTokenCookie: boolean;
  hasSessionDataCookie: boolean;
};

export class UnauthenticatedError extends BaseError<
  UnauthenticatedErrorCode,
  "No valid session.",
  UnauthenticatedErrorMeta
> {
  readonly name = "UnauthenticatedError";
  readonly code = UNAUTHENTICATED_ERROR_CODE;

  constructor({
    message,
    meta,
  }: {
    message: string;
    meta: UnauthenticatedErrorMeta;
  }) {
    super({ message, cause: "No valid session.", meta });
  }
}

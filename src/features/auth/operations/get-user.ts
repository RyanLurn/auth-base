import type { FlatError } from "@little-nebulae/error";
import type {
  AsyncEncodedResult,
  SuperJSONResultOf,
} from "@little-nebulae/superjson";

import { createJsonFailure, unwrapResult } from "@little-nebulae/result";
import { createEncodedSuccess } from "@little-nebulae/superjson";
import { createServerFn } from "@tanstack/react-start";
import { getRequestHeaders } from "@tanstack/react-start/server";

import type { UnauthenticatedErrorCode } from "@/features/auth/errors/unauthenticated";
import type { AuthUser } from "@/features/auth/types";
import type { DefaultFlatError } from "@/lib/result";

import { serverGetAuthUser } from "@/features/auth/operations/server-get-user";
import { defaultJsonFailure } from "@/lib/result";
import { superjsonCodec } from "@/lib/superjson";

export const getAuthUser = createServerFn().handler(
  async (): AsyncEncodedResult<
    SuperJSONResultOf<AuthUser>,
    FlatError<UnauthenticatedErrorCode> | DefaultFlatError
  > => {
    const headers = getRequestHeaders();
    const getUserResult = await serverGetAuthUser({ headers });
    if (getUserResult.success) {
      const encodedUser = unwrapResult(
        superjsonCodec.encode({
          input: getUserResult.data,
        }),
      );
      return createEncodedSuccess(encodedUser);
    }

    const getUserError = getUserResult.error;
    if (getUserError.code === "UNAUTHENTICATED_ERROR") {
      return createJsonFailure({
        code: getUserError.code,
        message: "You are unauthenticated. Please sign in to continue.",
        meta: null,
      } satisfies FlatError<UnauthenticatedErrorCode>);
    }
    return defaultJsonFailure;
  },
);

import type { AsyncResult } from "@little-nebulae/result";

import { composeErrorMessage, UnexpectedError } from "@little-nebulae/error";
import { createFailure, createSuccess } from "@little-nebulae/result";
import { getHeader } from "@little-nebulae/web-fetch";
import { createServerOnlyFn } from "@tanstack/react-start";
import { parseCookies } from "better-auth/cookies";

import type { UnauthenticatedErrorMeta } from "@/features/auth/errors/unauthenticated";
import type { AuthUser } from "@/features/auth/types";

import {
  SESSION_DATA_COOKIE,
  SESSION_TOKEN_COOKIE,
} from "@/features/auth/constants";
import { UnauthenticatedError } from "@/features/auth/errors/unauthenticated";
import { authServer } from "@/features/auth/server";

export const getAuthUser = createServerOnlyFn(
  async ({
    headers,
  }: {
    headers: Headers;
  }): AsyncResult<
    AuthUser,
    UnauthenticatedError | UnexpectedError<unknown, UnauthenticatedErrorMeta>
  > => {
    const cookieHeader = getHeader({ headers, name: "cookie" });
    const cookieMap = parseCookies(cookieHeader ?? "");
    const meta = {
      hasSessionTokenCookie: cookieMap.has(SESSION_TOKEN_COOKIE),
      hasSessionDataCookie: cookieMap.has(SESSION_DATA_COOKIE),
    } satisfies UnauthenticatedErrorMeta;
    const operation = "get user";

    try {
      const getSessionResult = await authServer.api.getSession({ headers });
      if (getSessionResult === null) {
        return createFailure(
          new UnauthenticatedError({
            message: composeErrorMessage({
              operation,
              reason: "empty or invalid session data",
            }),
            meta,
          }),
        );
      }
      return createSuccess(getSessionResult.user);
    } catch (error) {
      return createFailure(
        new UnexpectedError({
          message: composeErrorMessage({ operation }),
          cause: error,
          meta,
        }),
      );
    }
  },
);

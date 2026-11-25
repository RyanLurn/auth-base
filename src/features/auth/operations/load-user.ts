import type { FlatError, UnexpectedErrorCode } from "@little-nebulae/error";
import type { AsyncJsonResult } from "@little-nebulae/result";
import type { Except } from "type-fest";

import { HTTP_ERROR_RESPONSE_STATUS_ENUM } from "@little-nebulae/http";
import { createJsonFailure, createJsonSuccess } from "@little-nebulae/result";
import { createServerFn } from "@tanstack/react-start";
import {
  getRequestHeaders,
  setResponseStatus,
} from "@tanstack/react-start/server";

import type { UnauthenticatedErrorCode } from "@/features/auth/errors/unauthenticated";
import type { AuthUser } from "@/features/auth/types";

import { getAuthUser } from "@/features/auth/operations/get-user";

export const loadAuthUser = createServerFn().handler(
  async (): AsyncJsonResult<
    Except<AuthUser, "createdAt" | "updatedAt" | "image"> & {
      image: string | null;
    },
    FlatError<UnauthenticatedErrorCode> | FlatError<UnexpectedErrorCode>
  > => {
    const headers = getRequestHeaders();

    const getAuthUserResult = await getAuthUser({ headers });

    if (getAuthUserResult.success) {
      const {
        createdAt: _createdAt,
        updatedAt: _updatedAt,
        image = null,
        ...rest
      } = getAuthUserResult.data;
      return createJsonSuccess({ ...rest, image });
    }

    const getAuthUserError = getAuthUserResult.error;

    if (getAuthUserError.code === "UNAUTHENTICATED_ERROR") {
      setResponseStatus(
        HTTP_ERROR_RESPONSE_STATUS_ENUM.UNAUTHORIZED.CODE,
        HTTP_ERROR_RESPONSE_STATUS_ENUM.UNAUTHORIZED.TEXT,
      );
      return createJsonFailure({
        code: getAuthUserError.code,
        message: "You are unauthenticated. Please sign in to continue.",
        meta: null,
      } satisfies FlatError<UnauthenticatedErrorCode>);
    }

    setResponseStatus(
      HTTP_ERROR_RESPONSE_STATUS_ENUM.INTERNAL_SERVER_ERROR.CODE,
      HTTP_ERROR_RESPONSE_STATUS_ENUM.INTERNAL_SERVER_ERROR.TEXT,
    );
    return createJsonFailure({
      code: getAuthUserError.code,
      message:
        "Something went wrong. Please try again later or contact support.",
      meta: null,
    } satisfies FlatError<UnexpectedErrorCode>);
  },
);

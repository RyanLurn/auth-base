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

import type { UNAUTHENTICATED_ERROR_CODE } from "@/features/auth/constants";
import type { AuthUser } from "@/features/auth/types";

import { getAuthSession } from "@/features/auth/operations/get-session";

export const loadAuthUser = createServerFn().handler(
  async (): AsyncJsonResult<
    Except<AuthUser, "createdAt" | "updatedAt" | "image"> & {
      image: string | null;
    },
    | FlatError<typeof UNAUTHENTICATED_ERROR_CODE>
    | FlatError<UnexpectedErrorCode>
  > => {
    const headers = getRequestHeaders();

    const getAuthSessionResult = await getAuthSession({ headers });

    if (getAuthSessionResult.success) {
      const { user } = getAuthSessionResult.data;
      const {
        createdAt: _createdAt,
        updatedAt: _updatedAt,
        image = null,
        ...rest
      } = user;
      return createJsonSuccess({ ...rest, image });
    }

    const getAuthSessionError = getAuthSessionResult.error;

    if (getAuthSessionError.code === "UNAUTHENTICATED_ERROR") {
      setResponseStatus(
        HTTP_ERROR_RESPONSE_STATUS_ENUM.UNAUTHORIZED.CODE,
        HTTP_ERROR_RESPONSE_STATUS_ENUM.UNAUTHORIZED.TEXT,
      );
      return createJsonFailure({
        code: getAuthSessionError.code,
        message: "You are unauthenticated. Please sign in to continue.",
        meta: null,
      } satisfies FlatError<typeof UNAUTHENTICATED_ERROR_CODE>);
    }

    setResponseStatus(
      HTTP_ERROR_RESPONSE_STATUS_ENUM.INTERNAL_SERVER_ERROR.CODE,
      HTTP_ERROR_RESPONSE_STATUS_ENUM.INTERNAL_SERVER_ERROR.TEXT,
    );
    return createJsonFailure({
      code: getAuthSessionError.code,
      message:
        "Something went wrong. Please try again later or contact support.",
      meta: null,
    } satisfies FlatError<UnexpectedErrorCode>);
  },
);

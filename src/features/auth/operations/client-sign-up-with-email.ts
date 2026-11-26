import type { Except } from "type-fest";

import { composeErrorMessage, UnexpectedError } from "@little-nebulae/error";
import { createFailure, createSuccess } from "@little-nebulae/result";
import { createClientOnlyFn } from "@tanstack/react-start";

import type { SignUpParams } from "@/features/auth/schemas";

import { authClient } from "@/features/auth/client";
import { Route as VerifyEmailRoute } from "@/routes/(auth)/verify-email";

export const clientSignUpWithEmail = createClientOnlyFn(
  async ({
    name,
    email,
    password,
  }: Except<SignUpParams, "confirmPassword">) => {
    try {
      const { data, error } = await authClient.signUp.email({
        name,
        email,
        password,
        callbackURL: VerifyEmailRoute.to,
      });

      if (data) {
        return createSuccess(data);
      }

      return createFailure(
        new UnexpectedError({
          message: composeErrorMessage({ operation: "sign up with email" }),
          cause: error,
          meta: null,
        }),
      );
    } catch (error) {
      return createFailure(
        new UnexpectedError({
          message: composeErrorMessage({ operation: "sign up with email" }),
          cause: error,
          meta: null,
        }),
      );
    }
  },
);

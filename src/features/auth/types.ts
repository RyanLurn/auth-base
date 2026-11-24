import type { authServer } from "@/features/auth/server";

export type AuthSession = typeof authServer.$Infer.Session.session;
export type AuthUser = typeof authServer.$Infer.Session.user;

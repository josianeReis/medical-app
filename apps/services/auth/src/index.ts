import * as fs from "fs";

import { Context, Elysia } from "elysia";

import { auth } from "./auth";
import { cors } from "@elysiajs/cors";
import { env } from "./config/env";
import { swagger } from "@elysiajs/swagger";

const authReference = await auth.api.generateOpenAPISchema();


const betterAuthView = (context: Context) => {
  const BETTER_AUTH_ACCEPT_METHODS = ["POST", "GET"];

  if (BETTER_AUTH_ACCEPT_METHODS.includes(context.request.method)) {
    return auth.handler(context.request);
  } else {
    context.error(405);
  }
};

const app = new Elysia()
  .use(cors())
  // .use(
  //   swagger({
  //     documentation: authReference,
  //     path: "/api/auth/reference",
  //   })
  // )
  .all("/api/auth/*", betterAuthView)
  .get("/api/auth/reference/openapi", () => authReference)
  .listen(env.API_PORT);

console.log(
  `🦊 Auth service is running at ${app.server?.hostname}:${app.server?.port}`
);

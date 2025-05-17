import * as fs from "fs";

import { Context, Elysia } from "elysia";

import { auth } from "./auth";
import { cors } from "@elysiajs/cors";
import { env } from "./config/env";
import { swagger } from "@elysiajs/swagger";
import openApi from "../openapi.json";

const betterAuthView = (context: Context) => {
  const BETTER_AUTH_ACCEPT_METHODS = ["POST", "GET"];

  if (BETTER_AUTH_ACCEPT_METHODS.includes(context.request.method)) {
    return auth.handler(context.request);
  } else {
    context.status(405);
  }
};

const app = new Elysia()
  .use(cors())
  .get("/health", ({ status }) => status(200))
  .use(
    swagger({
      documentation: JSON.parse(JSON.stringify(openApi)),
      path: "/api/auth/reference",
    })
  )
  .all("/api/auth/*", betterAuthView)
  .listen(env.API_PORT);

console.log(
  `🦊 Auth service is running at ${app.server?.hostname}:${app.server?.port}`
);

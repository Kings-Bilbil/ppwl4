import { Elysia } from "elysia";
import { openapi } from "@elysiajs/openapi";

const app = new Elysia()
  .use(openapi())
  .onRequest(({ request, set }) => {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] ${request.method} ${request.url}`);

    if (request.headers.get("x-test") === "block") {
      set.status = 403;
      return {
        success: false,
        message: "Request Blocked!",
      };
    }
  })
  .get("/hello", () => {
    return { message: "Hello, request kamu berhasil masuk!" };
  })
  .listen(3000);

console.log(`Elysia is running at ${app.server?.hostname}:${app.server?.port}`);
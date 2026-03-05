import { Elysia, t } from "elysia";
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
  .get(
    "/admin",
    () => {
      return {
        stats: 99,
      };
    },
    {
      beforeHandle({ headers, set }) {
        if (headers.authorization !== "Bearer 123") {
          set.status = 401;
          return {
            success: false,
            message: "Unauthorized",
          };
        }
      },
    }
  )
  .get(
    "/product",
    () => {
      return { id: 1, name: "Laptop" };
    },
    {
      afterHandle({ response }) {
        return {
          success: true,
          Message: "data tersedia",
          data: response,
        };
      },
    }
  )
  .post(
    "/login",
    ({ body }) => {
      return { success: true, data: body };
    },
    {
      body: t.Object({
        email: t.String({ format: "email" }),
        password: t.String(),
      }),
    }
  )
  .onError(({ code, set }) => {
    if (code === "VALIDATION") {
      set.status = 400;
      return {
        success: false,
        error: "Validation Error",
      };
    }
  })
  .listen(3000);

console.log(`Elysia is running at ${app.server?.hostname}:${app.server?.port}`);
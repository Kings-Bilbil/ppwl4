import { Elysia, t } from "elysia";
import { openapi } from "@elysiajs/openapi";

const app = new Elysia()
  .use(openapi())
  // --- KODE PRAKTIKUM 1 ---
  .post(
    "/request",
    ({ body }) => {
      return {
        message: "Success",
        data: body,
      };
    },
    {
      body: t.Object({
        name: t.String({ minLength: 3 }),
        email: t.String({ format: "email" }),
        age: t.Number({ minimum: 18 }),
      }),
    }
  )
  // --- KODE PRAKTIKUM 2 ---
  .get(
    "/products/:id",
    ({ params, query }) => {
      return {
        message: "Berhasil mengambil data produk",
        productId: params.id,
        sortOrder: query.sort,
      };
    },
    {
      params: t.Object({
        // t.Numeric() digunakan untuk mengonversi string dari URL menjadi angka dan memvalidasinya
        id: t.Numeric(),
      }),
      query: t.Object({
        // Membatasi input query 'sort' hanya boleh "asc" atau "desc"
        sort: t.Optional(t.Union([t.Literal("asc"), t.Literal("desc")])),
      }),
    }
  )
  .listen(3000);

console.log(`Elysia is running at ${app.server?.hostname}:${app.server?.port}`);
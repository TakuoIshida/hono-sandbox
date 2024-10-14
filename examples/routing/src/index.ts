import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { z } from "zod";

const querySchema = z.object({
  email: z.string().email("Invalid email address"),
  name: z.string().min(3, "Name is required"),
  age: z
    .string()
    .transform((val) => parseInt(val))
    .refine((val) => val > 0, "Invalid id"),
});

const paramSchema = z.object({
  id: z.string().transform((val) => parseInt(val)),
});

const authorsApp = new Hono()
  .get("/", (c) => c.json({ result: "list authors" }))
  .post("/", (c) => c.json({ result: "create an author" }, 201))
  .get("/:id", (c) => {
    const queryParams = c.req.query();
    const param = c.req.param();
    const paramResult = paramSchema.safeParse(param);
    const queryResult = querySchema.safeParse(queryParams);
    if (!queryResult.success) {
      return c.json({ error: queryResult.error }, 400);
    }
    if (!paramResult.success) {
      return c.json({ error: paramResult.error }, 400);
    }
    const { name, age, email } = queryResult.data;
    const { id } = paramResult.data;
    console.log(id, name, age, email);

    return c.json({ result: `get ${c.req.param("id")}` });
  });

const booksApp = new Hono()
  .get("/", (c) => {
    const { q, limit, offset } = c.req.query();
    console.log(q, limit, offset);
    return c.json({ result: "list books" });
  })
  .post("/", (c) => c.json({ result: "create a book" }, 201))
  .get("/:id/", (c) => c.json({ result: `get ${c.req.param("id")}` }));

const app = new Hono()
  .basePath("/api")
  .route("/authors", authorsApp)
  .route("/books", booksApp);

const port = 4000;
console.log(`Server is running on port ${port}`);

serve({
  fetch: app.fetch,
  port,
});

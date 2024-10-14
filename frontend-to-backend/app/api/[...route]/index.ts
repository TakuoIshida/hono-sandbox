import { Hono } from "hono";
import { handle } from "hono/vercel";

const app = new Hono().basePath("/api/v1");

const route = app.get("/hello", (c) => {
  return c.json({
    message: "Hello Hono! from hono router",
  });
});

export type AppType = typeof route;
export default handle(app);

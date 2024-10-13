import { serve } from "@hono/node-server";
import { Hono } from "hono";

const app = new Hono();

const route = app.get("/api/v1/hello", (c) => {
  return c.json({
    message: "Hello Hono! from backend",
  });
});

const port = 4000;
console.log(`Server is running on port ${port}`);

serve({
  fetch: app.fetch,
  port,
});

export type AppType = typeof route;

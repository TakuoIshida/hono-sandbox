import { Hono } from "hono";
import { handle } from "hono/vercel";
import { hc } from "hono/client";
import { AppType } from "../../../backend/src/index";

export const runtime = "edge";

const app = new Hono().basePath("/api");

app.get("/hello", async (c) => {
  var message = "";
  try {
    const client = hc<AppType>("http://localhost:4000/");
    const res = await client.api.v1.hello.$get();
    console.log(res);
    message = await res.text();
  } catch (e) {
    console.error(e);
    return c.text("Error fetching data");
  }
  console.log(message);
  return c.text(message);
});

export const GET = handle(app);

import { serve } from "@hono/node-server";
import { z } from "zod";
import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { handle } from "hono/vercel";

const app = new Hono();

// カスタムZodスキーマ for YYYY-MM-DD形式の日付
const dateSchema = z.string().refine(
  (val) => {
    return /^\d{4}-\d{2}-\d{2}$/.test(val) && !isNaN(Date.parse(val));
  },
  {
    message: "Invalid date format. Use YYYY-MM-DD",
  }
);

// Todoのスキーマ
const TodoSchema = z.object({
  title: z.string().min(1).max(100),
  completed: z.boolean(),
  dueDate: dateSchema.optional(),
});

const dummyTodos = [
  {
    id: 1,
    text: "買い物に行く  from backend",
    completed: false,
    dueDate: "2023-06-15",
    category: "日常",
  },
  {
    id: 2,
    text: "レポートを書く  from backend",
    completed: true,
    dueDate: "2023-06-10",
    category: "仕事",
  },
  {
    id: 3,
    text: "運動する  from backend",
    completed: false,
    dueDate: "2023-06-16",
    category: "健康",
  },
  {
    id: 4,
    text: "本を読む  from backend",
    completed: false,
    dueDate: "2023-06-20",
    category: "趣味",
  },
  {
    id: 5,
    text: "友達と電話する  from backend",
    completed: true,
    dueDate: "2023-06-12",
    category: "社交",
  },
];

const route = app
  .get("/api/v1/hello", (c) => {
    return c.json({
      message: "Hello Hono! from backend",
    });
  })
  .get("/api/todos", (c) => {
    return c.json(dummyTodos);
  })
  .put("/api/todos/:id", zValidator("json", TodoSchema), async (c) => {
    const id = c.req.param("id");
    const validatedData = c.req.valid("json");
    return c.json({ id: id, completed: !validatedData.completed });
  });

const port = 4000;
console.log(`Server is running on port ${port}`);

serve({
  fetch: app.fetch,
  port,
});

export type AppType = typeof route;
export default handle(app);

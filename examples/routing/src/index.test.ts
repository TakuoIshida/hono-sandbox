import { testClient } from "hono/testing";
import { expect, it, describe } from "vitest";
import { app } from ".";

const client = testClient(app);

describe("authors", () => {
  it("get list", async () => {
    const res = await client.api.authors.$get({
      query: {
        email: "hono@example.com",
        name: "Hono",
        age: "20",
      },
    });
    expect(await res.json()).toEqual({ result: "list authors" });
    expect(res.status).toBe(200);
  });
  it("post one", async () => {
    const res = await client.api.authors.$post({
      json: {
        title: "John Doe",
        idDeleted: true,
      },
    });
    expect(await res.json()).toEqual({ result: "create an author" });
    expect(res.status).toBe(201);
  });
  it("get one", async () => {
    const res = await client.api.authors[":id"].$get({
      param: {
        id: "1",
      },
    });
    // https://github.com/honojs/hono/blob/main/src/request.test.ts
    expect(await res.json()).toEqual({ result: "get 1" });
    expect(res.status).toBe(200);
  });
});

describe("books", () => {
  it("get list", async () => {
    const res = await client.api.books.$get();
    expect(await res.json()).toEqual({ result: "list books" });
    expect(res.status).toBe(200);
  });
  it("get one", async () => {
    const res = await client.api.books[":id"].$get({
      param: {
        id: "1",
      },
    });
    expect(await res.json()).toEqual({ result: "get 1" });
    expect(res.status).toBe(200);
  });
  it("post one", async () => {
    const res = await client.api.books.$post();
    expect(await res.json()).toEqual({ result: "create a book" });
    expect(res.status).toBe(201);
  });
});

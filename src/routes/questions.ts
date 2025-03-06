import { Hono } from "hono";
import { hc } from "hono/client";

export const questionsApp = new Hono()
  .get("/", (c) => {
    return c.text("Questions");
  })
  .get("/:slug", (c) => {
    return c.text(`Question: ${c.req.param("slug")}`);
  })
  .post("/", (c) => {
    return c.text("Create question");
  })
  .patch("/:slug", (c) => {
    return c.text(`Update question: ${c.req.param("slug")}`);
  })
  .delete("/:slug", (c) => {
    return c.text(`Delete question: ${c.req.param("slug")}`);
  });

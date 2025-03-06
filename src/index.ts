import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { categoriesApp } from "./routes/categories.js";
import { questionsApp } from "./routes/questions.js";

const port = process.env.PORT ? parseInt(process.env.PORT as string) : 3000;

const app = new Hono()
  .route("/categories", categoriesApp)
  .route("/questions", questionsApp);

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

serve(
  {
    fetch: app.fetch,
    port: port,
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
  }
);

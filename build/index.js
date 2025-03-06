import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { categoriesApp } from "./routes/categories.js";
import { questionsApp } from "./routes/questions.js";
const app = new Hono()
    .route("/categories", categoriesApp)
    .route("/questions", questionsApp);
app.get("/", (c) => {
    return c.text("Hello Hono!");
});
serve({
    fetch: app.fetch,
    port: 3000,
}, (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
});

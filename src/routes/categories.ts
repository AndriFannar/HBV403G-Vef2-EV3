import {
  createCategory,
  getCategories,
  getCategory,
} from "../db/categories.db.js";
import { SlugSchema } from "../entities/slug.js";
import { hc } from "hono/client";
import { Hono } from "hono";
import xss from "xss";
import { CategorySchema } from "../entities/category.js";

export const categoriesApp = new Hono()
  .get("/", async (c) => {
    const categories = await getCategories();
    return c.json(categories);
  })

  .get("/:slug", async (c) => {
    const slug = xss(c.req.param("slug"));
    const parsedSlug = await SlugSchema.safeParseAsync(slug);
    if (!parsedSlug.success) {
      return c.json({ message: "Invalid slug" }, 400);
    }

    const category = await getCategory(parsedSlug.data);

    if (!category) {
      return c.json({ message: "Category not found" }, 404);
    }

    return c.json(category);
  })

  .post("/", async (c) => {
    let newCategory: unknown;
    try {
      newCategory = c.req.json();
    } catch (e) {
      return c.json({ message: "Invalid JSON" }, 400);
    }

    newCategory = xss(newCategory as string);
    const validCategory = await CategorySchema.safeParseAsync(newCategory);

    if (!validCategory.success) {
      return c.json(
        { message: "Invalid data", errors: validCategory.error.flatten() },
        400
      );
    }

    console.log(validCategory.data);
    //const createdCategory = await createCategory(validCategory.data);
    //return c.json(createdCategory, 201);
  })
  .patch("/:slug", (c) => {
    return c.text(`Update category: ${c.req.param("slug")}`);
  })
  .delete("/:slug", (c) => {
    return c.text(`Delete category: ${c.req.param("slug")}`);
  });

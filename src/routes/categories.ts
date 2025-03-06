import { validateAndSanitizeBaseCategory } from "../lib/validation/categoryValidator.js";
import { validateAndSanitizeSlug } from "../lib/validation/slugValidator.js";
import { BaseCategorySchema, CategorySchema } from "../entities/category.js";
import { SlugSchema } from "../entities/slug.js";
import { hc } from "hono/client";
import {
  createCategory,
  deleteCategory,
  getCategories,
  getCategory,
  updateCategory,
} from "../db/categories.db.js";
import { Hono } from "hono";
import { get } from "http";
import xss from "xss";

export const categoriesApp = new Hono()
  .get("/", async (c) => {
    try {
      const categories = await getCategories();
      return c.json(categories);
    } catch (e) {
      console.error("Failed to get categories:", e);
      throw e;
    }
  })

  .get("/:slug", async (c) => {
    try {
      const slug = await validateAndSanitizeSlug(c.req.param("slug"));
      if (!slug.data) {
        return c.json({ message: "Invalid slug" }, 400);
      }

      const category = await getCategory(slug.data);

      if (!category) {
        return c.json({ message: "Category not found" }, 404);
      }

      return c.json(category);
    } catch (e) {
      console.error("Failed to get category:", e);
      throw e;
    }
  })

  .post("/", async (c) => {
    try {
      let newCategory: unknown;
      try {
        newCategory = await c.req.json();
      } catch (e) {
        return c.json({ message: "Invalid JSON" }, 400);
      }

      const validCategory = await validateAndSanitizeBaseCategory(newCategory);

      if (!validCategory.data) {
        return c.json(
          { message: "Invalid data", errors: validCategory.error },
          400
        );
      }

      const createdCategory = await createCategory(validCategory.data);
      return c.json(createdCategory, 201);
    } catch (e) {
      console.error("Failed to create category:", e);
      throw e;
    }
  })

  .patch("/:slug", async (c) => {
    try {
      let updatedCategoryInfo: unknown;
      try {
        updatedCategoryInfo = await c.req.json();
      } catch (e) {
        return c.json({ message: "Invalid JSON" }, 400);
      }

      const slug = await validateAndSanitizeSlug(c.req.param("slug"));
      if (!slug.data) {
        return c.json({ message: "Invalid slug" }, 400);
      }

      if (getCategory(slug.data) === null) {
        return c.json({ message: "Category not found" }, 404);
      }

      const validCategory = BaseCategorySchema.safeParse(updatedCategoryInfo);

      if (!validCategory.success) {
        return c.json(
          { message: "Invalid data", errors: validCategory.error.flatten() },
          400
        );
      }

      validCategory.data.name = xss(validCategory.data.name);
      const updatedCategory = await updateCategory(
        c.req.param("slug"),
        validCategory.data
      );
      return c.json(updatedCategory);
    } catch (e) {
      console.error("Failed to update category:", e);
      throw e;
    }
  })

  .delete("/:slug", async (c) => {
    try {
      const slug = await validateAndSanitizeSlug(c.req.param("slug"));
      if (!slug.data) {
        return c.json({ message: "Invalid slug" }, 400);
      }

      if ((await getCategory(slug.data)) === null) {
        return c.json({ message: "Category not found" }, 404);
      }

      await deleteCategory(slug.data);
      return c.body(null, 204);
    } catch (e) {
      console.error("Failed to delete category:", e);
      throw e;
    }
  })

  .onError((err, c) => {
    console.error("Internal Server Error:", err);
    return c.json({ message: "Internal Server Error" }, 500);
  });

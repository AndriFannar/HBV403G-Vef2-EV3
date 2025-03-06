import { PrismaClient } from "@prisma/client";
import type { CategorySchema, Category } from "../entities/category.js";
import { z } from "zod";

const prisma = new PrismaClient();

export async function getCategories(
  limit: number = 10,
  offset: number = 0
): Promise<Array<Category>> {
  const categories = await prisma.categories.findMany();
  return categories ?? null;
}

export async function getCategory(slug: string): Promise<Category | null> {
  const category = await prisma.categories.findFirst({
    where: {
      slug: slug,
    },
  });
  return category ?? null;
}

export async function createCategory(category: Category): Promise<Category> {
  const newCategory = prisma.categories.create({
    data: category,
  });
  return newCategory;
}

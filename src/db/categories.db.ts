import { PrismaClient } from "@prisma/client";
import type {
  CategorySchema,
  Category,
  BaseCategory,
} from "../entities/category.js";
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

export async function createCategory(
  category: BaseCategory
): Promise<Category> {
  const newCategory = await prisma.categories.create({
    data: {
      name: category.name,
      slug: category.name.toLowerCase().replaceAll(" ", "-"),
    },
  });
  return newCategory;
}

export async function updateCategory(
  slug: string,
  category: BaseCategory
): Promise<Category> {
  const updatedCategory = await prisma.categories.update({
    where: {
      slug: slug,
    },
    data: {
      name: category.name,
      slug: category.name.toLowerCase().replaceAll(" ", "-"),
    },
  });
  return updatedCategory;
}

export async function deleteCategory(slug: string) {
  const deletedCategory = await prisma.categories.delete({
    where: {
      slug: slug,
    },
  });
}

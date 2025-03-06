import { PrismaClient } from "@prisma/client";
import { z } from "zod";
const prisma = new PrismaClient();
export async function getCategories(limit = 10, offset = 0) {
    const categories = await prisma.categories.findMany();
    return categories ?? null;
}
export async function getCategory(slug) {
    const category = await prisma.categories.findFirst({
        where: {
            slug: slug,
        },
    });
    return category ?? null;
}
export async function createCategory(category) {
    const newCategory = prisma.categories.create({
        data: category,
    });
    return newCategory;
}

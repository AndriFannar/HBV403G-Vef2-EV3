import { z } from "zod";

const minTitleLength = 3;
const maxTitleLength = 64;

export const BaseCategorySchema = z.object({
  name: z
    .string()
    .min(minTitleLength, `Title must be at least ${minTitleLength} letters`)
    .max(maxTitleLength, `Title must be at most ${maxTitleLength} letters`),
});

export const CategorySchema = BaseCategorySchema.extend({
  id: z.number(),
  slug: z.string().nonempty(),
});

export type BaseCategory = z.infer<typeof BaseCategorySchema>;
export type Category = z.infer<typeof CategorySchema>;

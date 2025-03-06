import { z } from "zod";

const minSlugLength = 3;
const maxSlugLength = 550;

export const SlugSchema = z
  .string()
  .min(minSlugLength, `Slug must be at least ${minSlugLength} letters`)
  .max(maxSlugLength, `Slug must be at most ${maxSlugLength} letters`)
  .regex(
    /^[a-z0-9-]+$/,
    `Slug must only contain lowercase letters, numbers, and hyphens`
  );

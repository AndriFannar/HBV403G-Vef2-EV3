import { BaseCategorySchema } from "../../entities/category.js";
import { z } from "zod";
import xss from "xss";

export const validateAndSanitizeBaseCategory = async (data: unknown) =>{
  const parsed = await BaseCategorySchema.safeParseAsync(data);
  if (!parsed.success) {
    return { error: parsed.error.format() };
  }

  const sanitizedData = {
    name: xss(parsed.data.name.trim()),
  };

  return { data: sanitizedData };
};
import { SlugSchema } from "../../entities/slug.js";
import xss from "xss";

export const validateAndSanitizeSlug = async (data: unknown) => {
  const parsed = await SlugSchema.safeParseAsync(data);
  if (!parsed.success) {
    return { error: parsed.error.format() };
  }

  const sanitizedData = xss(parsed.data.trim());

  return { data: sanitizedData };
};

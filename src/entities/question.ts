import { answerSchema } from "./answer.js";
import { z } from "zod";

const maxContentLength = 500;
const minContentLength = 3;
const minNoAnswers = 2;

export const QuestionSchema = z.object({
  id: z.number(),
  category_id: z.number(),
  question: z
    .string()
    .min(
      minContentLength,
      `Content must be at least ${minContentLength} letters`
    )
    .max(
      maxContentLength,
      `Content must be at most ${maxContentLength} letters`
    )
    .nonempty(),
  slug: z.string().nonempty(),
  answers: z
    .array(answerSchema)
    .length(minNoAnswers, `Question must have ${minNoAnswers} answers`),
});

export type Question = z.infer<typeof QuestionSchema>;

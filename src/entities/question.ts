import { AnswerSchema } from "./answer.js";
import { z } from "zod";

const maxContentLength = 500;
const minContentLength = 3;
const minNoAnswers = 2;

export const BaseQuestionSchema = z.object({
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
  answers: z
    .array(AnswerSchema)
    .length(minNoAnswers, `Question must have ${minNoAnswers} answers`),
});

export const QuestionSchema = BaseQuestionSchema.extend({
  id: z.number(),
  slug: z.string().nonempty(),
});

export type Question = z.infer<typeof QuestionSchema>;

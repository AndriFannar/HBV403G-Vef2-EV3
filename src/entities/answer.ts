import exp from "constants";
import { z } from "zod";

const minContentLength = 3;
const maxContentLength = 500;

export const BaseAnswerSchema = z.object({
  answer: z
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
  is_correct: z.boolean(),
});

export const AnswerSchema = BaseAnswerSchema.extend({
  id: z.number(),
  question_id: z.number(),
});


export type Answer = z.infer<typeof AnswerSchema>;

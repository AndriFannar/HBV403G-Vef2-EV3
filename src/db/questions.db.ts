import { PrismaClient } from "@prisma/client";
import type { Question, BaseQuestionSchema } from "../entities/question.js";
import { z } from "zod";
import { randomInt } from "crypto";

const prisma = new PrismaClient();

function generateSlug(question: string, id: number): string {
  return (
    id.toString() +
    "-" +
    question
      .toLowerCase()
      .replaceAll(" ", "-")
      .slice(0, 64 - id.toString().length - 1)
  );
}

export async function getAllQuestions(
  limit: number = 10,
  offset: number = 0
): Promise<Array<Question>> {
  const questions = await prisma.questions.findMany();
  return questions ?? null;
}

export async function getQuestionsByCategory(
  slug: string
): Promise<Array<Question> | null> {
  const category = await prisma.categories.findFirst({
    where: {
      slug: slug,
    },
  });

  if (!category) {
    return null;
  }

  const question = await prisma.questions.findMany({
    where: {
      category_id: category.id,
    },
  });

  return question ?? null;
}

export async function createQuestion(
  question: BaseQuestionSchema
): Promise<Question> {
  const newQuestion = await prisma.questions.create({
    data: {
      category_id: question.category_id,
      question: question.question,
      slug: randomInt(Number.MAX_VALUE).toString(),
      answers: question.answers,
    },
  });

  const newSlug = generateSlug(newQuestion.question, newQuestion.id);

  return await prisma.questions.update({
    where: {
      id: newQuestion.id,
    },
    data: {
      slug: newSlug,
    },
  });
}

export async function updateQuestion(
  slug: string,
  question: BaseQuestionSchema
): Promise<Question> {
  const updatedQuestion = await prisma.questions.update({
    where: {
      slug: slug,
    },
    data: {
      category_id: question.category_id,
      question: question.question,
      slug: generateSlug(question.question, question.id),
      answers: question.answers,
    },
  });
  return updatedQuestion;
}

export async function deleteQuestion(slug: string) {
  const deletedQuestion = await prisma.questions.delete({
    where: {
      slug: slug,
    },
  });
}

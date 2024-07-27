import { db } from "@/lib/db/index";
import { type QuestionId, questionIdSchema } from "@/lib/db/schema/questions";

export const getQuestions = async () => {
  const q = await db.question.findMany({include: { category: true}});
  return { questions: q };
};

export const getQuestionById = async (id: QuestionId) => {
  const { id: questionId } = questionIdSchema.parse({ id });
  const q = await db.question.findFirst({
    where: { id: questionId},
    include: { category: true }
  });
  return { question: q };
};



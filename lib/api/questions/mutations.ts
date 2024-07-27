import { db } from "@/lib/db/index";
import { 
  QuestionId, 
  NewQuestionParams,
  UpdateQuestionParams, 
  updateQuestionSchema,
  insertQuestionSchema, 
  questionIdSchema 
} from "@/lib/db/schema/questions";

export const createQuestion = async (question: NewQuestionParams) => {
  const newQuestion = insertQuestionSchema.parse(question);
  try {
    const q = await db.question.create({ data: newQuestion });
    return { question: q };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message };
  }
};

export const updateQuestion = async (id: QuestionId, question: UpdateQuestionParams) => {
  const { id: questionId } = questionIdSchema.parse({ id });
  const newQuestion = updateQuestionSchema.parse(question);
  try {
    const q = await db.question.update({ where: { id: questionId }, data: newQuestion})
    return { question: q };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message };
  }
};

export const deleteQuestion = async (id: QuestionId) => {
  const { id: questionId } = questionIdSchema.parse({ id });
  try {
    const q = await db.question.delete({ where: { id: questionId }})
    return { question: q };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message };
  }
};


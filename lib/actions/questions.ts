"use server";

import { revalidatePath } from "next/cache";
import {
  createQuestion,
  deleteQuestion,
  updateQuestion,
} from "@/lib/api/questions/mutations";
import {
  QuestionId,
  NewQuestionParams,
  UpdateQuestionParams,
  questionIdSchema,
  insertQuestionParams,
  updateQuestionParams,
} from "@/lib/db/schema/questions";

const handleErrors = (e: unknown) => {
  const errMsg = "Error, please try again.";
  if (e instanceof Error) return e.message.length > 0 ? e.message : errMsg;
  if (e && typeof e === "object" && "error" in e) {
    const errAsStr = e.error as string;
    return errAsStr.length > 0 ? errAsStr : errMsg;
  }
  return errMsg;
};

const revalidateQuestions = () => revalidatePath("/questions");

export const createQuestionAction = async (input: NewQuestionParams) => {
  try {
    const payload = insertQuestionParams.parse(input);
    await createQuestion(payload);
    revalidateQuestions();
  } catch (e) {
    return handleErrors(e);
  }
};

export const updateQuestionAction = async (input: UpdateQuestionParams) => {
  try {
    const payload = updateQuestionParams.parse(input);
    await updateQuestion(payload.id, payload);
    revalidateQuestions();
  } catch (e) {
    return handleErrors(e);
  }
};

export const deleteQuestionAction = async (input: QuestionId) => {
  try {
    const payload = questionIdSchema.parse({ id: input });
    await deleteQuestion(payload.id);
    revalidateQuestions();
  } catch (e) {
    return handleErrors(e);
  }
};
import { questionSchema } from "@/zodAutoGenSchemas";
import { z } from "zod";
import { timestamps } from "@/lib/utils";
import { getQuestions } from "@/lib/api/questions/queries";


// Schema for questions - used to validate API requests
const baseSchema = questionSchema.omit(timestamps)

export const insertQuestionSchema = baseSchema.omit({ id: true });
export const insertQuestionParams = baseSchema.extend({
  correctAnswerNumber: z.coerce.number(),
  categoryId: z.coerce.string().min(1)
}).omit({ 
  id: true
});

export const updateQuestionSchema = baseSchema;
export const updateQuestionParams = updateQuestionSchema.extend({
  correctAnswerNumber: z.coerce.number(),
  categoryId: z.coerce.string().min(1)
})
export const questionIdSchema = baseSchema.pick({ id: true });

// Types for questions - used to type API request params and within Components
export type Question = z.infer<typeof questionSchema>;
export type NewQuestion = z.infer<typeof insertQuestionSchema>;
export type NewQuestionParams = z.infer<typeof insertQuestionParams>;
export type UpdateQuestionParams = z.infer<typeof updateQuestionParams>;
export type QuestionId = z.infer<typeof questionIdSchema>["id"];
    
// this type infers the return from getQuestions() - meaning it will include any joins
export type CompleteQuestion = Awaited<ReturnType<typeof getQuestions>>["questions"][number];


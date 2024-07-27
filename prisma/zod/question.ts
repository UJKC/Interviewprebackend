import * as z from "zod"
import { CompleteCategory, relatedCategorySchema } from "./index"

export const questionSchema = z.object({
  id: z.string(),
  questionText: z.string(),
  optionOne: z.string(),
  optionTwo: z.string(),
  optionThree: z.string(),
  optionFour: z.string(),
  correctAnswerNumber: z.number().int(),
  solutionText: z.string(),
  referenceLink: z.string(),
  categoryId: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export interface CompleteQuestion extends z.infer<typeof questionSchema> {
  category: CompleteCategory
}

/**
 * relatedQuestionSchema contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const relatedQuestionSchema: z.ZodSchema<CompleteQuestion> = z.lazy(() => questionSchema.extend({
  category: relatedCategorySchema,
}))

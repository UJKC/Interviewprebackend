import * as z from "zod"
import { CompleteQuestion, relatedQuestionSchema } from "./index"

export const categorySchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export interface CompleteCategory extends z.infer<typeof categorySchema> {
  questions: CompleteQuestion[]
}

/**
 * relatedCategorySchema contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const relatedCategorySchema: z.ZodSchema<CompleteCategory> = z.lazy(() => categorySchema.extend({
  questions: relatedQuestionSchema.array(),
}))

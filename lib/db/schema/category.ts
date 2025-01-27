import { categorySchema } from "@/zodAutoGenSchemas";
import { z } from "zod";
import { timestamps } from "@/lib/utils";
import { getCategories } from "@/lib/api/category/queries";


// Schema for category - used to validate API requests
const baseSchema = categorySchema.omit(timestamps)

export const insertCategorySchema = baseSchema.omit({ id: true });
export const insertCategoryParams = baseSchema.extend({}).omit({ 
  id: true
});

export const updateCategorySchema = baseSchema;
export const updateCategoryParams = updateCategorySchema.extend({})
export const categoryIdSchema = baseSchema.pick({ id: true });

// Types for category - used to type API request params and within Components
export type Category = z.infer<typeof categorySchema>;
export type NewCategory = z.infer<typeof insertCategorySchema>;
export type NewCategoryParams = z.infer<typeof insertCategoryParams>;
export type UpdateCategoryParams = z.infer<typeof updateCategoryParams>;
export type CategoryId = z.infer<typeof categoryIdSchema>["id"];
    
// this type infers the return from getCategory() - meaning it will include any joins
export type CompleteCategory = Awaited<ReturnType<typeof getCategories>>["category"][number];


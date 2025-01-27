import { db } from "@/lib/db/index";
import { type CategoryId, categoryIdSchema } from "@/lib/db/schema/category";

export const getCategories = async () => {
  const c = await db.category.findMany({});
  return { category: c };
};

export const getCategoryById = async (id: CategoryId) => {
  const { id: categoryId } = categoryIdSchema.parse({ id });
  const c = await db.category.findFirst({
    where: { id: categoryId}});
  return { category: c };
};

export const getCategoryByIdWithQuestions = async (id: CategoryId) => {
  const { id: categoryId } = categoryIdSchema.parse({ id });
  const c = await db.category.findFirst({
    where: { id: categoryId},
    include: { questions: { include: {category: true } } }
  });
  if (c === null) return { category: null };
  const { questions, ...category } = c;

  return { category, questions:questions };
};


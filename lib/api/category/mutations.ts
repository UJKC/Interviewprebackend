import { db } from "@/lib/db/index";
import { 
  CategoryId, 
  NewCategoryParams,
  UpdateCategoryParams, 
  updateCategorySchema,
  insertCategorySchema, 
  categoryIdSchema 
} from "@/lib/db/schema/category";

export const createCategory = async (category: NewCategoryParams) => {
  const newCategory = insertCategorySchema.parse(category);
  try {
    const c = await db.category.create({ data: newCategory });
    return { category: c };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message };
  }
};

export const updateCategory = async (id: CategoryId, category: UpdateCategoryParams) => {
  const { id: categoryId } = categoryIdSchema.parse({ id });
  const newCategory = updateCategorySchema.parse(category);
  try {
    const c = await db.category.update({ where: { id: categoryId }, data: newCategory})
    return { category: c };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message };
  }
};

export const deleteCategory = async (id: CategoryId) => {
  const { id: categoryId } = categoryIdSchema.parse({ id });
  try {
    const c = await db.category.delete({ where: { id: categoryId }})
    return { category: c };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message };
  }
};


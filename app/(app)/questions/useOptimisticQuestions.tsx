import { type Category } from "@/lib/db/schema/category";
import { type Question, type CompleteQuestion } from "@/lib/db/schema/questions";
import { OptimisticAction } from "@/lib/utils";
import { useOptimistic } from "react";

export type TAddOptimistic = (action: OptimisticAction<Question>) => void;

export const useOptimisticQuestions = (
  questions: CompleteQuestion[],
  category: Category[]
) => {
  const [optimisticQuestions, addOptimisticQuestion] = useOptimistic(
    questions,
    (
      currentState: CompleteQuestion[],
      action: OptimisticAction<Question>,
    ): CompleteQuestion[] => {
      const { data } = action;

      const optimisticCategory = category.find(
        (category) => category.id === data.categoryId,
      )!;

      const optimisticQuestion = {
        ...data,
        category: optimisticCategory,
        id: "optimistic",
      };

      switch (action.action) {
        case "create":
          return currentState.length === 0
            ? [optimisticQuestion]
            : [...currentState, optimisticQuestion];
        case "update":
          return currentState.map((item) =>
            item.id === data.id ? { ...item, ...optimisticQuestion } : item,
          );
        case "delete":
          return currentState.map((item) =>
            item.id === data.id ? { ...item, id: "delete" } : item,
          );
        default:
          return currentState;
      }
    },
  );

  return { addOptimisticQuestion, optimisticQuestions };
};

import { Suspense } from "react";
import { notFound } from "next/navigation";

import { getCategoryByIdWithQuestions } from "@/lib/api/category/queries";
import OptimisticCategory from "./OptimisticCategory";
import QuestionList from "@/components/questions/QuestionList";

import { BackButton } from "@/components/shared/BackButton";
import Loading from "@/app/loading";


export const revalidate = 0;

export default async function CategoryPage({
  params,
}: {
  params: { categoryId: string };
}) {

  return (
    <main className="overflow-auto">
      <Category id={params.categoryId} />
    </main>
  );
}

const Category = async ({ id }: { id: string }) => {
  
  const { category, questions } = await getCategoryByIdWithQuestions(id);
  

  if (!category) notFound();
  return (
    <Suspense fallback={<Loading />}>
      <div className="relative">
        <BackButton currentResource="category" />
        <OptimisticCategory category={category}  />
      </div>
      <div className="relative mt-8 mx-4">
        <h3 className="text-xl font-medium mb-4">{category.name}&apos;s Questions</h3>
        <QuestionList
          category={[]}
          categoryId={category.id}
          questions={questions}
        />
      </div>
    </Suspense>
  );
};

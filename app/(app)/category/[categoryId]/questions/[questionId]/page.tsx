import { Suspense } from "react";
import { notFound } from "next/navigation";

import { getQuestionById } from "@/lib/api/questions/queries";
import { getCategories } from "@/lib/api/category/queries";import OptimisticQuestion from "@/app/(app)/questions/[questionId]/OptimisticQuestion";


import { BackButton } from "@/components/shared/BackButton";
import Loading from "@/app/loading";


export const revalidate = 0;

export default async function QuestionPage({
  params,
}: {
  params: { questionId: string };
}) {

  return (
    <main className="overflow-auto">
      <Question id={params.questionId} />
    </main>
  );
}

const Question = async ({ id }: { id: string }) => {
  
  const { question } = await getQuestionById(id);
  const { category } = await getCategories();

  if (!question) notFound();
  return (
    <Suspense fallback={<Loading />}>
      <div className="relative">
        <BackButton currentResource="questions" />
        <OptimisticQuestion question={question} category={category}
        categoryId={question.categoryId} />
      </div>
    </Suspense>
  );
};

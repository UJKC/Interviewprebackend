import { Suspense } from "react";

import Loading from "@/app/loading";
import QuestionList from "@/components/questions/QuestionList";
import { getQuestions } from "@/lib/api/questions/queries";
import { getCategories } from "@/lib/api/category/queries";

export const revalidate = 0;

export default async function QuestionsPage() {
  return (
    <main>
      <div className="relative">
        <div className="flex justify-between">
          <h1 className="font-semibold text-2xl my-2">Questions</h1>
        </div>
        <Questions />
      </div>
    </main>
  );
}

const Questions = async () => {
  
  const { questions } = await getQuestions();
  const { category } = await getCategories();
  return (
    <Suspense fallback={<Loading />}>
      <QuestionList questions={questions} category={category} />
    </Suspense>
  );
};

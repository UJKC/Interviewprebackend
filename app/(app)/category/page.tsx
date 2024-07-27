import { Suspense } from "react";

import Loading from "@/app/loading";
import CategoryList from "@/components/category/CategoryList";
import { getCategories } from "@/lib/api/category/queries";


export const revalidate = 0;

export default async function CategoryPage() {
  return (
    <main>
      <div className="relative">
        <div className="flex justify-between">
          <h1 className="font-semibold text-2xl my-2">Category</h1>
        </div>
        <Category />
      </div>
    </main>
  );
}

const Category = async () => {
  
  const { category } = await getCategories();
  
  return (
    <Suspense fallback={<Loading />}>
      <CategoryList category={category}  />
    </Suspense>
  );
};

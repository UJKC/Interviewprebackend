"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import { type Category, CompleteCategory } from "@/lib/db/schema/category";
import Modal from "@/components/shared/Modal";

import { Button } from "@/components/ui/button";
import CategoryForm from "./CategoryForm";
import { PlusIcon } from "lucide-react";
import { useOptimisticCategories } from "@/app/(app)/category/useOptimisticCategory";

type TOpenModal = (category?: Category) => void;

export default function CategoryList({
  category,
   
}: {
  category: CompleteCategory[];
   
}) {
  const { optimisticCategories, addOptimisticCategory } = useOptimisticCategories(
    category,
     
  );
  const [open, setOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<Category | null>(null);
  const openModal = (category?: Category) => {
    setOpen(true);
    category ? setActiveCategory(category) : setActiveCategory(null);
  };
  const closeModal = () => setOpen(false);

  return (
    <div>
      <Modal
        open={open}
        setOpen={setOpen}
        title={activeCategory ? "Edit Category" : "Create Category"}
      >
        <CategoryForm
          category={activeCategory}
          addOptimistic={addOptimisticCategory}
          openModal={openModal}
          closeModal={closeModal}
          
        />
      </Modal>
      <div className="absolute right-0 top-0 ">
        <Button onClick={() => openModal()} variant={"outline"}>
          +
        </Button>
      </div>
      {optimisticCategories.length === 0 ? (
        <EmptyState openModal={openModal} />
      ) : (
        <ul>
          {optimisticCategories.map((category) => (
            <Category
              category={category}
              key={category.id}
              openModal={openModal}
            />
          ))}
        </ul>
      )}
    </div>
  );
}

const Category = ({
  category,
  openModal,
}: {
  category: CompleteCategory;
  openModal: TOpenModal;
}) => {
  const optimistic = category.id === "optimistic";
  const deleting = category.id === "delete";
  const mutating = optimistic || deleting;
  const pathname = usePathname();
  const basePath = pathname.includes("category")
    ? pathname
    : pathname + "/category/";


  return (
    <li
      className={cn(
        "flex justify-between my-2",
        mutating ? "opacity-30 animate-pulse" : "",
        deleting ? "text-destructive" : "",
      )}
    >
      <div className="w-full">
        <div>{category.name}</div>
      </div>
      <Button variant={"link"} asChild>
        <Link href={ basePath + "/" + category.id }>
          Edit
        </Link>
      </Button>
    </li>
  );
};

const EmptyState = ({ openModal }: { openModal: TOpenModal }) => {
  return (
    <div className="text-center">
      <h3 className="mt-2 text-sm font-semibold text-secondary-foreground">
        No category
      </h3>
      <p className="mt-1 text-sm text-muted-foreground">
        Get started by creating a new category.
      </p>
      <div className="mt-6">
        <Button onClick={() => openModal()}>
          <PlusIcon className="h-4" /> New Category </Button>
      </div>
    </div>
  );
};

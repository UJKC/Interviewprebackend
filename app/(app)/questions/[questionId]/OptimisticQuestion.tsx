"use client";

import { useOptimistic, useState } from "react";
import { TAddOptimistic } from "@/app/(app)/questions/useOptimisticQuestions";
import { type Question } from "@/lib/db/schema/questions";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import Modal from "@/components/shared/Modal";
import QuestionForm from "@/components/questions/QuestionForm";
import { type Category, type CategoryId } from "@/lib/db/schema/category";

export default function OptimisticQuestion({ 
  question,
  category,
  categoryId 
}: { 
  question: Question; 
  
  category: Category[];
  categoryId?: CategoryId
}) {
  const [open, setOpen] = useState(false);
  const openModal = (_?: Question) => {
    setOpen(true);
  };
  const closeModal = () => setOpen(false);
  const [optimisticQuestion, setOptimisticQuestion] = useOptimistic(question);
  const updateQuestion: TAddOptimistic = (input) =>
    setOptimisticQuestion({ ...input.data });

  return (
    <div className="m-4">
      <Modal open={open} setOpen={setOpen}>
        <QuestionForm
          question={optimisticQuestion}
          category={category}
        categoryId={categoryId}
          closeModal={closeModal}
          openModal={openModal}
          addOptimistic={updateQuestion}
        />
      </Modal>
      <div className="flex justify-between items-end mb-4">
        <h1 className="font-semibold text-2xl">{optimisticQuestion.questionText}</h1>
        <Button className="" onClick={() => setOpen(true)}>
          Edit
        </Button>
      </div>
      <pre
        className={cn(
          "bg-secondary p-4 rounded-lg break-all text-wrap",
          optimisticQuestion.id === "optimistic" ? "animate-pulse" : "",
        )}
      >
        {JSON.stringify(optimisticQuestion, null, 2)}
      </pre>
    </div>
  );
}

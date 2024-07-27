"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import { type Question, CompleteQuestion } from "@/lib/db/schema/questions";
import Modal from "@/components/shared/Modal";
import { type Category, type CategoryId } from "@/lib/db/schema/category";
import { useOptimisticQuestions } from "@/app/(app)/questions/useOptimisticQuestions";
import { Button } from "@/components/ui/button";
import QuestionForm from "./QuestionForm";
import { PlusIcon } from "lucide-react";

type TOpenModal = (question?: Question) => void;

export default function QuestionList({
  questions,
  category,
  categoryId 
}: {
  questions: CompleteQuestion[];
  category: Category[];
  categoryId?: CategoryId 
}) {
  const { optimisticQuestions, addOptimisticQuestion } = useOptimisticQuestions(
    questions,
    category 
  );
  const [open, setOpen] = useState(false);
  const [activeQuestion, setActiveQuestion] = useState<Question | null>(null);
  const openModal = (question?: Question) => {
    setOpen(true);
    question ? setActiveQuestion(question) : setActiveQuestion(null);
  };
  const closeModal = () => setOpen(false);

  return (
    <div>
      <Modal
        open={open}
        setOpen={setOpen}
        title={activeQuestion ? "Edit Question" : "Create Question"}
      >
        <QuestionForm
          question={activeQuestion}
          addOptimistic={addOptimisticQuestion}
          openModal={openModal}
          closeModal={closeModal}
          category={category}
        categoryId={categoryId}
        />
      </Modal>
      <div className="absolute right-0 top-0 ">
        <Button onClick={() => openModal()} variant={"outline"}>
          +
        </Button>
      </div>
      {optimisticQuestions.length === 0 ? (
        <EmptyState openModal={openModal} />
      ) : (
        <ul>
          {optimisticQuestions.map((question) => (
            <Question
              question={question}
              key={question.id}
              openModal={openModal}
            />
          ))}
        </ul>
      )}
    </div>
  );
}

const Question = ({
  question,
  openModal,
}: {
  question: CompleteQuestion;
  openModal: TOpenModal;
}) => {
  const optimistic = question.id === "optimistic";
  const deleting = question.id === "delete";
  const mutating = optimistic || deleting;
  const pathname = usePathname();
  const basePath = pathname.includes("questions")
    ? pathname
    : pathname + "/questions/";


  return (
    <li
      className={cn(
        "flex justify-between my-2",
        mutating ? "opacity-30 animate-pulse" : "",
        deleting ? "text-destructive" : "",
      )}
    >
      <div className="w-full">
        <div>{question.questionText}</div>
      </div>
      <Button variant={"link"} asChild>
        <Link href={ basePath + "/" + question.id }>
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
        No questions
      </h3>
      <p className="mt-1 text-sm text-muted-foreground">
        Get started by creating a new question.
      </p>
      <div className="mt-6">
        <Button onClick={() => openModal()}>
          <PlusIcon className="h-4" /> New Questions </Button>
      </div>
    </div>
  );
};

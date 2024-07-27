import { z } from "zod";

import { useState, useTransition } from "react";
import { useFormStatus } from "react-dom";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useValidatedForm } from "@/lib/hooks/useValidatedForm";

import { type Action, cn } from "@/lib/utils";
import { type TAddOptimistic } from "@/app/(app)/questions/useOptimisticQuestions";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useBackPath } from "@/components/shared/BackButton";



import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { type Question, insertQuestionParams } from "@/lib/db/schema/questions";
import {
  createQuestionAction,
  deleteQuestionAction,
  updateQuestionAction,
} from "@/lib/actions/questions";
import { type Category, type CategoryId } from "@/lib/db/schema/category";

const QuestionForm = ({
  category,
  categoryId,
  question,
  openModal,
  closeModal,
  addOptimistic,
  postSuccess,
}: {
  question?: Question | null;
  category: Category[];
  categoryId?: CategoryId
  openModal?: (question?: Question) => void;
  closeModal?: () => void;
  addOptimistic?: TAddOptimistic;
  postSuccess?: () => void;
}) => {
  const { errors, hasErrors, setErrors, handleChange } =
    useValidatedForm<Question>(insertQuestionParams);
  const editing = !!question?.id;
  
  const [isDeleting, setIsDeleting] = useState(false);
  const [pending, startMutation] = useTransition();

  const router = useRouter();
  const backpath = useBackPath("questions");


  const onSuccess = (
    action: Action,
    data?: { error: string; values: Question },
  ) => {
    const failed = Boolean(data?.error);
    if (failed) {
      openModal && openModal(data?.values);
      toast.error(`Failed to ${action}`, {
        description: data?.error ?? "Error",
      });
    } else {
      router.refresh();
      postSuccess && postSuccess();
      toast.success(`Question ${action}d!`);
      if (action === "delete") router.push(backpath);
    }
  };

  const handleSubmit = async (data: FormData) => {
    setErrors(null);

    const payload = Object.fromEntries(data.entries());
    const questionParsed = await insertQuestionParams.safeParseAsync({ categoryId, ...payload });
    if (!questionParsed.success) {
      setErrors(questionParsed?.error.flatten().fieldErrors);
      return;
    }

    closeModal && closeModal();
    const values = questionParsed.data;
    const pendingQuestion: Question = {
      updatedAt: question?.updatedAt ?? new Date(),
      createdAt: question?.createdAt ?? new Date(),
      id: question?.id ?? "",
      ...values,
    };
    try {
      startMutation(async () => {
        addOptimistic && addOptimistic({
          data: pendingQuestion,
          action: editing ? "update" : "create",
        });

        const error = editing
          ? await updateQuestionAction({ ...values, id: question.id })
          : await createQuestionAction(values);

        const errorFormatted = {
          error: error ?? "Error",
          values: pendingQuestion 
        };
        onSuccess(
          editing ? "update" : "create",
          error ? errorFormatted : undefined,
        );
      });
    } catch (e) {
      if (e instanceof z.ZodError) {
        setErrors(e.flatten().fieldErrors);
      }
    }
  };

  return (
    <form action={handleSubmit} onChange={handleChange} className={"space-y-8"}>
      {/* Schema fields start */}
              <div>
        <Label
          className={cn(
            "mb-2 inline-block",
            errors?.questionText ? "text-destructive" : "",
          )}
        >
          Question Text
        </Label>
        <Input
          type="text"
          name="questionText"
          className={cn(errors?.questionText ? "ring ring-destructive" : "")}
          defaultValue={question?.questionText ?? ""}
        />
        {errors?.questionText ? (
          <p className="text-xs text-destructive mt-2">{errors.questionText[0]}</p>
        ) : (
          <div className="h-6" />
        )}
      </div>
        <div>
        <Label
          className={cn(
            "mb-2 inline-block",
            errors?.optionOne ? "text-destructive" : "",
          )}
        >
          Option One
        </Label>
        <Input
          type="text"
          name="optionOne"
          className={cn(errors?.optionOne ? "ring ring-destructive" : "")}
          defaultValue={question?.optionOne ?? ""}
        />
        {errors?.optionOne ? (
          <p className="text-xs text-destructive mt-2">{errors.optionOne[0]}</p>
        ) : (
          <div className="h-6" />
        )}
      </div>
        <div>
        <Label
          className={cn(
            "mb-2 inline-block",
            errors?.optionTwo ? "text-destructive" : "",
          )}
        >
          Option Two
        </Label>
        <Input
          type="text"
          name="optionTwo"
          className={cn(errors?.optionTwo ? "ring ring-destructive" : "")}
          defaultValue={question?.optionTwo ?? ""}
        />
        {errors?.optionTwo ? (
          <p className="text-xs text-destructive mt-2">{errors.optionTwo[0]}</p>
        ) : (
          <div className="h-6" />
        )}
      </div>
        <div>
        <Label
          className={cn(
            "mb-2 inline-block",
            errors?.optionThree ? "text-destructive" : "",
          )}
        >
          Option Three
        </Label>
        <Input
          type="text"
          name="optionThree"
          className={cn(errors?.optionThree ? "ring ring-destructive" : "")}
          defaultValue={question?.optionThree ?? ""}
        />
        {errors?.optionThree ? (
          <p className="text-xs text-destructive mt-2">{errors.optionThree[0]}</p>
        ) : (
          <div className="h-6" />
        )}
      </div>
        <div>
        <Label
          className={cn(
            "mb-2 inline-block",
            errors?.optionFour ? "text-destructive" : "",
          )}
        >
          Option Four
        </Label>
        <Input
          type="text"
          name="optionFour"
          className={cn(errors?.optionFour ? "ring ring-destructive" : "")}
          defaultValue={question?.optionFour ?? ""}
        />
        {errors?.optionFour ? (
          <p className="text-xs text-destructive mt-2">{errors.optionFour[0]}</p>
        ) : (
          <div className="h-6" />
        )}
      </div>
        <div>
        <Label
          className={cn(
            "mb-2 inline-block",
            errors?.correctAnswerNumber ? "text-destructive" : "",
          )}
        >
          Correct Answer Number
        </Label>
        <Input
          type="text"
          name="correctAnswerNumber"
          className={cn(errors?.correctAnswerNumber ? "ring ring-destructive" : "")}
          defaultValue={question?.correctAnswerNumber ?? ""}
        />
        {errors?.correctAnswerNumber ? (
          <p className="text-xs text-destructive mt-2">{errors.correctAnswerNumber[0]}</p>
        ) : (
          <div className="h-6" />
        )}
      </div>
        <div>
        <Label
          className={cn(
            "mb-2 inline-block",
            errors?.solutionText ? "text-destructive" : "",
          )}
        >
          Solution Text
        </Label>
        <Input
          type="text"
          name="solutionText"
          className={cn(errors?.solutionText ? "ring ring-destructive" : "")}
          defaultValue={question?.solutionText ?? ""}
        />
        {errors?.solutionText ? (
          <p className="text-xs text-destructive mt-2">{errors.solutionText[0]}</p>
        ) : (
          <div className="h-6" />
        )}
      </div>
        <div>
        <Label
          className={cn(
            "mb-2 inline-block",
            errors?.referenceLink ? "text-destructive" : "",
          )}
        >
          Reference Link
        </Label>
        <Input
          type="text"
          name="referenceLink"
          className={cn(errors?.referenceLink ? "ring ring-destructive" : "")}
          defaultValue={question?.referenceLink ?? ""}
        />
        {errors?.referenceLink ? (
          <p className="text-xs text-destructive mt-2">{errors.referenceLink[0]}</p>
        ) : (
          <div className="h-6" />
        )}
      </div>

      {categoryId ? null : <div>
        <Label
          className={cn(
            "mb-2 inline-block",
            errors?.categoryId ? "text-destructive" : "",
          )}
        >
          Category
        </Label>
        <Select defaultValue={question?.categoryId} name="categoryId">
          <SelectTrigger
            className={cn(errors?.categoryId ? "ring ring-destructive" : "")}
          >
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent>
          {category?.map((category) => (
            <SelectItem key={category.id} value={category.id.toString()}>
              {category.id}{/* TODO: Replace with a field from the category model */}
            </SelectItem>
           ))}
          </SelectContent>
        </Select>
        {errors?.categoryId ? (
          <p className="text-xs text-destructive mt-2">{errors.categoryId[0]}</p>
        ) : (
          <div className="h-6" />
        )}
      </div> }
      {/* Schema fields end */}

      {/* Save Button */}
      <SaveButton errors={hasErrors} editing={editing} />

      {/* Delete Button */}
      {editing ? (
        <Button
          type="button"
          disabled={isDeleting || pending || hasErrors}
          variant={"destructive"}
          onClick={() => {
            setIsDeleting(true);
            closeModal && closeModal();
            startMutation(async () => {
              addOptimistic && addOptimistic({ action: "delete", data: question });
              const error = await deleteQuestionAction(question.id);
              setIsDeleting(false);
              const errorFormatted = {
                error: error ?? "Error",
                values: question,
              };

              onSuccess("delete", error ? errorFormatted : undefined);
            });
          }}
        >
          Delet{isDeleting ? "ing..." : "e"}
        </Button>
      ) : null}
    </form>
  );
};

export default QuestionForm;

const SaveButton = ({
  editing,
  errors,
}: {
  editing: Boolean;
  errors: boolean;
}) => {
  const { pending } = useFormStatus();
  const isCreating = pending && editing === false;
  const isUpdating = pending && editing === true;
  return (
    <Button
      type="submit"
      className="mr-2"
      disabled={isCreating || isUpdating || errors}
      aria-disabled={isCreating || isUpdating || errors}
    >
      {editing
        ? `Sav${isUpdating ? "ing..." : "e"}`
        : `Creat${isCreating ? "ing..." : "e"}`}
    </Button>
  );
};

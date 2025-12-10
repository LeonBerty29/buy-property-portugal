"use client";
import { useState, useTransition } from "react";
import { useRouter } from "@/i18n/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { CheckCircle, Trash2, AlertTriangle } from "lucide-react";
import { NotesResponse } from "@/types";
import { useTranslations } from "next-intl";

// Zod validation schema
const noteFormSchema = z.object({
  note: z
    .string()
    .min(1, "propertyNotesForm.noteCannotBeEmpty")
    .max(1000, "propertyNotesForm.noteIsTooLong"),
});

type NoteFormData = z.infer<typeof noteFormSchema>;

export const PropertyNoteForm = ({
  propertyId,
  reference,
  note,
}: {
  propertyId: number;
  reference: string;
  note: NotesResponse["data"][number];
}) => {
  const t = useTranslations("propertyNotesForm");
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSuccessDialogOpen, setIsSuccessDialogOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<NoteFormData>({
    resolver: zodResolver(noteFormSchema),
    defaultValues: {
      note: note.notes || "",
    },
  });

  const onSubmit = async (data: NoteFormData) => {
    setIsLoading(true);

    try {
      const response = await fetch(`/api/notes/${propertyId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          notes: data.note,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to update note: ${response.statusText}`);
      }

      startTransition(() => {
        router.refresh();
        setSuccessMessage(t("yourNoteHasBeenUpdatedSuccessfully"));
        setIsSuccessDialogOpen(true);
      });
    } catch (error) {
      console.error("Error updating note:", error);
      toast.error(t("failedToUpdateNotePleaseTryAgain"));
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteClick = () => {
    setIsDeleteConfirmOpen(true);
  };

  const handleDeleteConfirm = async () => {
    setIsDeleteConfirmOpen(false);
    setIsDeleting(true);

    try {
      const response = await fetch(`/api/notes/${propertyId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to delete note: ${response.statusText}`);
      }

      startTransition(() => {
        router.refresh();
        setSuccessMessage(t("yourNoteHasBeenDeletedSuccessfully"));
        setIsSuccessDialogOpen(true);
      });
    } catch (error) {
      console.error("Error deleting note:", error);
      toast.error(t("failedToDeleteNotePleaseTryAgain"));
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeleteCancel = () => {
    setIsDeleteConfirmOpen(false);
  };

  const handleSuccessClose = () => {
    setIsSuccessDialogOpen(false);
  };

  // Determine if any operation is in progress
  const isAnyOperationPending = isLoading || isDeleting || isPending;

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="grid flex-1 gap-2">
        <Label htmlFor="note" className="sr-only">
          {t("updateYourNotes")}
        </Label>

        <Textarea
          {...register("note")}
          rows={8}
          placeholder={`${t("addNotesFor")} ${reference}`}
          className={`w-full ${errors.note ? "border-red-500" : ""}`}
          disabled={isAnyOperationPending}
        />

        {errors.note && (
          <p className="text-sm text-red-500 mt-1">
            {t(errors.note.message as string)}
          </p>
        )}

        <div className="flex items-center gap-4 mt-5">
          <DeleteNoteButton
            onDelete={handleDeleteClick}
            isDeleting={isDeleting}
            disabled={isAnyOperationPending}
            t={t}
          />
          <Button
            type="submit"
            disabled={isAnyOperationPending}
            className="inline-block bg-primary text-white flex-1"
          >
            {isLoading
              ? t("updating")
              : isPending
              ? t("refreshing")
              : t("update")}
          </Button>
        </div>
      </form>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteConfirmOpen} onOpenChange={setIsDeleteConfirmOpen}>
        <DialogContent className="sm:max-w-md rounded-2xl">
          <DialogHeader>
            <div className="flex items-center justify-center mb-4">
              <AlertTriangle className="h-12 w-12 text-red-500" />
            </div>
            <DialogTitle className="text-center text-xl font-semibold">
              {t("deleteNote")}
            </DialogTitle>
            <DialogDescription className="text-center text-gray-600 mt-2">
              {t("areYouSureDeleteNoteFor")} {reference}
              {t("thisActionCannotBeUndone")}
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-3 mt-6">
            <Button
              onClick={handleDeleteCancel}
              variant="outline"
              className="flex-1"
              disabled={isDeleting}
            >
              {t("cancel")}
            </Button>
            <Button
              onClick={handleDeleteConfirm}
              className="flex-1 bg-red-500 hover:bg-red-600 text-white"
              disabled={isDeleting}
            >
              {isDeleting ? t("deleting") : t("yesDelete")}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Success Dialog */}
      <Dialog open={isSuccessDialogOpen} onOpenChange={setIsSuccessDialogOpen}>
        <DialogContent className="sm:max-w-md rounded-2xl">
          <DialogHeader>
            <div className="flex items-center justify-center mb-4">
              <CheckCircle className="h-12 w-12 text-green-500" />
            </div>
            <DialogTitle className="text-center text-xl font-semibold">
              {t("success")}
            </DialogTitle>
            <DialogDescription className="text-center text-gray-600 mt-2">
              {successMessage}
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-center mt-6">
            <Button
              onClick={handleSuccessClose}
              disabled={isPending}
              className="flex-1 bg-primary hover:bg-primary/90 text-white px-8"
            >
              {isPending ? t("refreshing") : t("close")}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

const DeleteNoteButton = ({
  onDelete,
  isDeleting,
  disabled,
  t,
}: {
  onDelete: () => void;
  isDeleting: boolean;
  disabled: boolean;
  t: (key: string) => string;
}) => {
  return (
    <Button
      type="button"
      onClick={onDelete}
      disabled={disabled}
      className="bg-transparent border border-gray-800 text-gray-800 hover:text-white hover:bg-gray-800 transition-colors flex-1 flex items-center justify-center gap-2 disabled:opacity-50"
    >
      {isDeleting ? (
        t("deleting")
      ) : disabled ? (
        t("pleaseWait")
      ) : (
        <>
          <Trash2 className="h-4 w-4" />
          {t("delete")}
        </>
      )}
    </Button>
  );
};
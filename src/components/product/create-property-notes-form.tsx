"use client";
import { Label } from "@/components/ui/label";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { useActionState, useState, useTransition } from "react";
import { createNote } from "@/actions/notes";
import { Link, useRouter } from "@/i18n/navigation";
import { toast } from "sonner";
import { useEffect } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CheckCircle } from "lucide-react";
import { useTranslations } from "next-intl"; // client component translation hook

export const CreatePropertyNoteForm = ({
  propertyId,
  reference,
}: {
  propertyId: number;
  reference: string;
}) => {
  const t = useTranslations("createPropertyNotesForm"); // single top-level translation key

  const [state, formAction, isPending] = useActionState(createNote, {});
  const [isSuccessDialogOpen, setIsSuccessDialogOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const router = useRouter();
  const [pendingTransition, startTransition] = useTransition();

  // Handle toast notifications based on state changes
  useEffect(() => {
    if (state.success) {
      startTransition(() => {
        router.refresh();
      });
      toast.success(state.success);
      setIsSuccessDialogOpen(true);
      setSuccessMessage(state.success);
    }
    if (state.error) {
      toast.error(state.error);
    }
    if (state.authenticated) {
      toast.error(state.authenticated, {
        duration: 2000,
        action: (
          <>
            <Button asChild className="bg-primary text-white hover:bg-black">
              <Link href={"/login"}>{t("login")}</Link>
            </Button>
          </>
        ),
      });
    }
  }, [
    state.success,
    state.error,
    state.authenticated,
    router,
    reference,
    t,
  ]);

  return (
    <>
      <form className="grid flex-1 gap-2" action={formAction}>
        <input type="hidden" name="propertyId" value={propertyId} />
        <input type="hidden" name="reference" value={reference} />
        <Label htmlFor="link" className="sr-only">
          {t("updateYourNotes")}
        </Label>
        <Textarea
          placeholder={`${t("addNotesFor")} ${reference}`}
          name="note"
          className="w-full"
        />
        <Button
          type="submit"
          className="w-full inline-block ml-auto bg-primary text-white"
          disabled={isPending || pendingTransition}
        >
          {t("addNote")}
        </Button>
      </form>

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
            <DialogClose asChild>
              <Button className="bg-primary hover:bg-primary/90 text-white px-8">
                {t("close")}
              </Button>
            </DialogClose>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

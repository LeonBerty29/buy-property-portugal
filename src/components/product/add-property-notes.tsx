import { auth } from "@/auth";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { Pencil } from "lucide-react";
import { PropertyNotesWrapperDialog } from "./property-notes-wrapper";
import { ListPropertyNoteForm } from "./property-notes-dialog";
import { NoteObject } from "@/types";
import { cn } from "@/lib/utils";
import { AddNoteRedirectBtn } from "../shared/add-note-redirect-btn";
import { getTranslations } from "next-intl/server";

interface AddPropertyNoteProps {
  propertyId: number;
  reference: string;
  notes: NoteObject[];
  styleClassname?: string;
  children?: React.ReactNode;
}

export const AddPropertyNote = async ({
  propertyId,
  reference,
  notes,
  styleClassname,
  children,
}: AddPropertyNoteProps) => {
  const t = await getTranslations("addPropertyNotes");

  const session = await auth();
  const token = session?.accessToken;
  return (
    <>
      {token ? (
        <>
          <PropertyNotesWrapperDialog
            customTrigger={children}
            propertyId={propertyId}
            reference={reference}
            styleClassname={styleClassname}
          >
            <ListPropertyNoteForm
              propertyId={propertyId}
              reference={reference}
              notes={notes}
            />
          </PropertyNotesWrapperDialog>
        </>
      ) : (
        <Dialog>
          <DialogTrigger asChild>
            <Button
              className="bg-transparent !p-2 h-6 w-6 rounded-full hover:bg-transparent shadow-2xl"
              type="button"
            >
              <Pencil
                className={cn("size-5 text-white shadow-2xl", styleClassname)}
              />
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>
                {t("addNoteForProperty")} {reference}
              </DialogTitle>
              <DialogDescription>{t("keepNoteForProperty")}</DialogDescription>
            </DialogHeader>
            <div className="flex flex-col gap-2">
              <p>{t("needToBeLoggedInToAddNote")}</p>
              <AddNoteRedirectBtn propertyId={propertyId} />
            </div>
            <DialogFooter className="sm:justify-start">
              <DialogClose asChild>
                <Button type="button" variant="ghost">
                  {t("close")}
                </Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

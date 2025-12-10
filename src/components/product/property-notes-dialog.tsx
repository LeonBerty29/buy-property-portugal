import { PropertyNoteForm } from "./property-notes-form";
import { CreatePropertyNoteForm } from "./create-property-notes-form";
import { NoteObject } from "@/types";


interface PropertyNotesDialogContentProps {
  propertyId: number;
  reference: string;
  notes: NoteObject[];
}

export async function ListPropertyNoteForm({
  propertyId,
  reference,
  notes,
}: PropertyNotesDialogContentProps) {

  const note = notes.find((note) => note.property_id === propertyId);

  return (
    <>
      {note ? (
        <PropertyNoteForm
          propertyId={propertyId}
          reference={reference}
          note={note}
        />
      ) : (
        <CreatePropertyNoteForm 
        propertyId={propertyId} 
        reference={reference} 
        />
      )}
    </>
  );
}

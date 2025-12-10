import z from "zod";

export const NoteSchema = z.object({
  propertyId: z.number(),
  note: z.string(),
});

export type NoteType = z.infer<typeof NoteSchema>;

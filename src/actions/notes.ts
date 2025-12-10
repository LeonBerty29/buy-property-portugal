"use server";

import { auth } from "@/auth";
import { CreateNote } from "@/data/notes";
import { NoteSchema } from "@/types/notes";
import { getTranslations } from "next-intl/server";

type ActionState = {
  success?: string;
  error?: string;
  authenticated?: string;
  timestamp?: number;
};

export async function createNote(
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const t = await getTranslations("notesAction");
  const propertyId = formData.get("propertyId") as string;
  const reference = formData.get("reference") as string;
  const note = formData.get("note") as string;

  const validatedData = NoteSchema.safeParse({
    propertyId: Number(propertyId),
    note,
  });

  if (!validatedData.success) {
    return {
      error: t("invalidFormValues"),
      timestamp: Date.now(),
    };
  }

  try {
    const session = await auth();
    const token = session?.accessToken;

    if (!propertyId) {
      return {
        error: t("propertyIdRequired"),
        timestamp: Date.now(),
      };
    }

    if (!token) {
      return {
        authenticated: t("loginRequired"),
        timestamp: Date.now(),
      };
    }

    // Create Note Api
    await CreateNote({ propertyId: Number(propertyId), note });

    return {
      success: `${t("noteCreatedPart1")} ${reference} ${t("noteCreatedPart2")}`,
      timestamp: Date.now(),
    };
  } catch (error) {
    console.error(`${t("noteCreateErrorLog")} ${reference}`, error);
    return {
      error: `${t("noteCreateFailedPart1")} ${reference} ${t("noteCreateFailedPart2")}`,
      timestamp: Date.now(),
    };
  }
}

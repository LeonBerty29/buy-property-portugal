"use server";

import { ZodIssue } from "zod";
import { getClientBookMeetingSchema } from "@/types/book-a-meeting";
import { bookMeetingWithDetailedErrors } from "@/data/book-meeting";
import { getTranslations } from "next-intl/server";

export interface BookMeetingActionResult {
  success: boolean;
  message?: string;
  errors?: { [key: string]: string[] };
  fieldErrors?: { [key: string]: string };
}

export async function bookMeetingAction(
  formData: FormData
): Promise<BookMeetingActionResult> {
  const t = await getTranslations("bookMeetingAction");
  try {
    // Extract data from FormData
    const rawData = {
      first_name: formData.get("first_name") as string,
      last_name: formData.get("last_name") as string,
      phone: formData.get("phone") as string,
      email: formData.get("email") as string,
      meeting_date: new Date(formData.get("meeting_date") as string),
      meeting_time: formData.get("meeting_time") as string,
      meeting_type: formData.get("meeting_type") as string,
      meeting_location: formData.get("meeting_location") as string,
      additional_text: (formData.get("additional_text") as string) || undefined,
      source_url: (formData.get("source_url") as string) || undefined,
      accept_terms: Boolean(formData.get("accept_terms")) || undefined,
    };

    // console.log({ rawData });

    const recaptchaToken = formData.get("recaptcha_token") as string;

    // Validate the data using Zod schema
    const bookMeetingSchemaJson = await getTranslations(
      "clientBookMeetingSchema"
    );
    const bookMeetingSchema = getClientBookMeetingSchema(bookMeetingSchemaJson);
    const validationResult = bookMeetingSchema.safeParse(rawData);

    // console.log({ validationResult });
    // console.log({ error: validationResult.error });

    if (!validationResult.success) {
      // Convert Zod errors to field errors with proper typing
      // console.log({ errorsSSSS: validationResult.error.errors });
      // console.log({ errorsPath: validationResult.error.errors[0].path });
      const fieldErrors: { [key: string]: string } = {};
      validationResult.error.errors.forEach((error: ZodIssue) => {
        const fieldName = error.path[0];
        if (fieldName && typeof fieldName === "string") {
          fieldErrors[fieldName] = error.message;
        }
      });

      // console.log({ fieldErrors });

      return {
        success: false,
        message: t("checkFormForErrors"),
        fieldErrors,
      };
    }

    if (!recaptchaToken) {
      return {
        success: false,
        message: t("recaptchaTokenMissing"),
      };
    }

    const secretKey = process.env.RECAPTCHA_SECRET_KEY;

    const verificationResponse = await fetch(
      `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${recaptchaToken}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );
    const verification = await verificationResponse.json();

    if (verification.success && verification.score > 0.5) {
      // console.log({ success: true, score: verification.score });
    } else {
      console.log({
        success: false,
        score: verification.score,
        errorCodes: verification["error-codes"],
      });
      return {
        success: false,
        message: t("recaptchaVerificationFailed"),
      };
    }

    // Call the API
    const result = await bookMeetingWithDetailedErrors(validationResult.data);

    if (!result.success) {
      return {
        success: false,
        message: result.error ? result.error : t("failedToBookMeeting"),
        errors: result.validationErrors,
      };
    }

    return {
      success: true,
      message: result.data?.message
        ? result.data.message
        : t("meetingBookedSuccessfully"),
    };
  } catch (error) {
    console.error("Book meeting action error:", error);

    return {
      success: false,
      message: t("unexpectedError"),
    };
  }
}

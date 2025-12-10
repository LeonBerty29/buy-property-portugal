"use server";

import { getUserProfileSchema, UserProfileFormData } from "@/schema";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import { getTranslations } from "next-intl/server";

export const updateProfile = async (
  values: UserProfileFormData
  // callbackUrl: string | undefined
) => {
  const t = await getTranslations("updateProfileAction");
  const schemaTranslations = await getTranslations("schemaTranslations");
    const UserProfileSchema = getUserProfileSchema(schemaTranslations);

  const validatedFields = UserProfileSchema.safeParse(values);

  if (!validatedFields.success) {
    return {
      error: {
        message: t("invalidFields"),
        first_name: "",
        last_name: "",
      },
    };
  }

  const session = await auth();
  const accessToken = session?.accessToken;

  const { first_name, last_name, phone_number, newsletter } =
    validatedFields.data;

  try {
    const endpoint = `/v1/auth/client/update`;
    const config: RequestInit = {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        first_name: first_name,
        last_name: last_name,
        phone: phone_number,
        newsletter: newsletter,
      }),
    };

    const url = `${process.env.API_BASE_URL}${endpoint}`;
    const response: Response = await fetch(url, config);

    if (!response.ok) {
      if (response.status === 401) {
        return {
          error: {
            message: t("unableToUpdateProfile"),
            first_name: "",
            last_name: "",
          },
        };
      }

      const responseErrors = await response.json();

      if (response.status === 422) {
        const error = {
          message: t("userCreationError"),
          first_name: "",
          last_name: "",
        };

        const errorObject = responseErrors.errors;

        if (errorObject.first_name) {
          error.first_name = errorObject.first_name[0];
        }

        if (errorObject.last_name) {
          error.last_name = errorObject.last_name[0];
        }

        if (responseErrors.message) {
          error.message = responseErrors.message;
        }

        return {
          error,
        };
      }

      return {
        error: {
          message: responseErrors.message,
          first_name: "",
          last_name: "",
        },
      };
    }

    const user = await response.json();

    if (!user) {
      return {
        error: {
          message: t("updatingProfileError"),
          first_name: "",
          last_name: "",
        },
      };
    }
  } catch (error) {
    console.log(error);

    if (error instanceof Error) {
      return {
        error: {
          message: error.message,
          first_name: "",
          last_name: "",
        },
      };
    }
    return {
      error: {
        message: t("connectionError"),
        first_name: "",
        last_name: "",
      },
    };
  }

  revalidatePath("/settings");

  return { success: t("profileUpdated") };
};
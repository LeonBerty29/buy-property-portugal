"use server";

import { getTranslations } from "next-intl/server";
import { getRegisterSchema, RegisterFormData } from "@/schema";

export const register = async (values: RegisterFormData) => {
  const t = await getTranslations("registerAction");
  const schemaTranslations = await getTranslations("schemaTranslations");
  const RegisterSchema = getRegisterSchema(schemaTranslations);

  const validatedFields = RegisterSchema.safeParse(values);

  if (!validatedFields.success) {
    return {
      error: {
        message: t("invalidFields"),
        password: "",
        email: "",
        first_name: "",
        last_name: "",
        password_confirmation: "",
      },
    };
  }

  const { email, password, first_name, last_name, password_confirmation } =
    validatedFields.data;
  const newsletter = false;

  try {
    const endpoint = `/v1/auth/client/register`;
    const config: RequestInit = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
        first_name,
        last_name,
        password_confirmation,
        newsletter,
      }),
    };

    const url = `${process.env.API_BASE_URL}${endpoint}`;
    const response: Response = await fetch(url, config);

    if (!response.ok) {
      const errorResponse = await response.json();

      if (errorResponse || response.status === 422) {
        const error = {
          message: errorResponse.message || t("errorCreatingUser"),
          password: "",
          email: "",
          first_name: "",
          last_name: "",
          password_confirmation: "",
        };

        const errorObject = errorResponse.errors;

        if (errorObject.password) {
          error.password = errorObject.password[0];
        }
        if (errorObject.email) {
          error.email = errorObject.email[0];
        }
        if (errorObject.first_name) {
          error.first_name = errorObject.first_name[0];
        }
        if (errorObject.last_name) {
          error.last_name = errorObject.last_name[0];
        }
        if (errorObject.password_confirmation) {
          error.password_confirmation = errorObject.password_confirmation[0];
        }

        return {
          error,
        };
      }

      throw new Error(
        `API Error: ${response.status} ${response.statusText} - ${errorResponse}`,
        {
          cause: response,
        }
      );
    }

    const user = await response.json();

    if (!user) {
      return {
        error: {
          message: t("errorCreatingUser"),
          password: "",
          email: "",
          first_name: "",
          last_name: "",
          password_confirmation: "",
        },
      };
    }
  } catch (error) {
    console.log(error);
    return {
      error: {
        message: t("internetConnectionError"),
        password: "",
        email: "",
        first_name: "",
        last_name: "",
        password_confirmation: "",
      },
    };
  }

  return { success: t("userCreated") };
};

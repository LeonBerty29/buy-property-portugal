"use client";

import { CardWrapper } from "./card-wrapper";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState, useTransition } from "react";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { getRegisterSchema, RegisterFormData } from "@/schema";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { FormError } from "./form-error";
import { FormSuccess } from "./form-success";
import { register } from "@/actions/register";
// import { signIn } from "next-auth/react";
// import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { AuthError } from "next-auth";
import { toast } from "sonner";
import { useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";

type ErrorType = {
  message: string;
  password?: string;
  email?: string;
  first_name?: string;
  last_name?: string;
  password_confirmation?: string;
};

export const RegisterForm = ({
  callbackUrl,
}: {
  callbackUrl: string | undefined;
}) => {
  const t = useTranslations("registerForm");
  const schemaTranslations = useTranslations("schemaTranslations");
  const RegisterSchema = getRegisterSchema(schemaTranslations);
  const [error, setError] = useState<ErrorType | undefined>({
    message: "",
    password: "",
    email: "",
    first_name: "",
    last_name: "",
    password_confirmation: "",
  });
  const [success, setSuccess] = useState<string | undefined>("");

  const [isPending, startTransition] = useTransition();

  const router = useRouter();

  const form = useForm<RegisterFormData>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      email: "",
      password: "",
      first_name: "",
      last_name: "",
      password_confirmation: "",
    },
  });

  const onSubmit = (values: RegisterFormData) => {
    setError({
      message: "",
      password: "",
      email: "",
      first_name: "",
      last_name: "",
      password_confirmation: "",
    });
    setSuccess("");

    startTransition(() => {
      register(values).then((data) => {
        setError(data.error);
        setSuccess(data.success);

        if (data.success) {
          try {
            // signIn("credentials", {
            //   email: values.email,
            //   password: values.password,
            //   redirectTo: callbackUrl || DEFAULT_LOGIN_REDIRECT,
            // });

            toast.success(t("toastUserCreated"));
            router.push({
              pathname: "/account/created",
              query: {
                email: values.email,
                callbackUrl: callbackUrl,
              },
            });
          } catch (error) {
            if (error instanceof AuthError) {
              // switch (error.type) {
              //   case "CredentialsSignin":
              //     return { error: "Invalid credentials" };
              //   default:
              //     return {
              //       error:
              //         "Something went wrong. Please check your internet connection and try again",
              //     };
              // }

              toast.error(t("toastUnexpectedError"));
            }

            // throw error;
          }
        }
      });
    });
  };

  return (
    <div>
      <CardWrapper
        headerLabel={t("headerLabel")}
        backButtonLabel={t("backButtonLabel")}
        backButtonHref="/login"
        showSocial={false}
      >
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="first_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("firstNameLabel")}</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder={t("firstNamePlaceholder")}
                        type="text"
                        disabled={isPending}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="last_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("lastNameLabel")}</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder={t("lastNamePlaceholder")}
                        type="text"
                        disabled={isPending}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("emailLabel")}</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder={t("emailPlaceholder")}
                        type="email"
                        disabled={isPending}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("passwordLabel")}</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder=""
                        type="password"
                        disabled={isPending}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password_confirmation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("confirmPasswordLabel")}</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder=""
                        type="password"
                        disabled={isPending}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormError message={error?.message} />
            <FormSuccess message={success} />

            <Button type="submit" className="w-full" disabled={isPending}>
              {t("createAccountButton")}
            </Button>
          </form>
        </Form>
      </CardWrapper>
    </div>
  );
};
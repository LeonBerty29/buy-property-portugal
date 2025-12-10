"use client";

import { useTranslations } from "next-intl";

import { CardWrapper } from "./card-wrapper";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState, useTransition } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { getLoginSchema, LoginFormData } from "@/schema";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
// import { login } from "@/actions/login";
import { FormError } from "./form-error";
import { FormSuccess } from "./form-success";
// import { signIn } from "@/auth";
import { login } from "@/actions/login";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { Link, useRouter } from "@/i18n/navigation";
import { useSession } from "next-auth/react";
import { PiWarningCircle } from "react-icons/pi";
import { X } from "lucide-react";
// import { toast } from "sonner";

export const LoginForm = ({
  callbackUrl,
}: {
  callbackUrl: string | undefined;
}) => {
  const t = useTranslations("loginForm");
  const schemaTranslations = useTranslations("schemaTranslations");
  const LoginSchema = getLoginSchema(schemaTranslations);

  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [responseError, setResponseError] = useState<{
    message: string;
    responseStatus: number | undefined;
    email: string;
  }>({
    message: "",
    responseStatus: undefined,
    email: "",
  });

  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const { update } = useSession();

  const form = useForm<LoginFormData>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
    reValidateMode: "onChange",
  });

  const onSubmit = (values: LoginFormData) => {
    setError("");
    setSuccess("");

    startTransition(() => {
      login(
        values
        //  callbackUrl
      ).then(async (data) => {
        // console.log({ dataResponse: data });
        setError(data?.error);
        setSuccess(data?.success);

        if (data?.success) {
          // const link = document.createElement("a");
          // link.href = callbackUrl || DEFAULT_LOGIN_REDIRECT;
          // link.click();
          await update();
          router.refresh();

          // @ts-expect-error -- Typescript will validate only known `params`
          // are used in combination with a given `pathname`. Since the two will
          // always match for the current route, we can skip runtime checks
          router.push(callbackUrl || DEFAULT_LOGIN_REDIRECT);
        }

        if (data.response?.responseStatus === 403) {
          setResponseError({
            // ...responseError,
            message: data.error as string,
            responseStatus: data.response?.responseStatus,
            email: values.email,
          });
        }
      });
    });
  };

  return (
    <>
      <CardWrapper
        headerLabel={t("welcomeBack")}
        backButtonLabel={t("createNewAccount")}
        backButtonHref={`/register${
          callbackUrl ? `?callbackUrl=${callbackUrl}` : ""
        }`}
        showSocial={false}
      >
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("email")}</FormLabel>
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
                    <FormLabel>{t("password")}</FormLabel>
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

            <FormError message={error} />
            <FormSuccess message={success} />

            <Button type="submit" className="w-full" disabled={isPending}>
              {t("login")}
            </Button>

            <Button
              type="button"
              variant={"ghost"}
              className="flex mx-auto bg-transparent hover:bg-transparent hover:text-primary text-primary hover:underline"
              asChild
            >
              <Link href="/account/forgot-password">{t("forgotPassword")}</Link>
            </Button>
          </form>
        </Form>
      </CardWrapper>

      {/* Error Dialog - Token expired / 410 response */}
      <Dialog open={responseError.responseStatus == 403}>
        <DialogContent
          showCloseButton={false}
          className="sm:max-w-md rounded-2xl"
        >
          <DialogClose asChild>
            <Button
              variant="ghost"
              className="absolute right-4 top-4"
              onClick={() => {
                setResponseError({
                  message: "",
                  responseStatus: undefined,
                  email: "",
                });
              }}
            >
              <X className="h-4 w-4" />
            </Button>
          </DialogClose>
          <DialogHeader className="text-center">
            <div className="flex justify-center mb-4">
              <PiWarningCircle className="h-16 w-16 text-orange-500" />
            </div>
            <DialogTitle className="text-xl text-center">
              {t("alert")}
            </DialogTitle>
          </DialogHeader>

          <div className="text-center space-y-4">
            <p className="text-gray-600">{responseError.message}</p>
          </div>

          <div className="flex gap-4 justify-center pt-4 mb-2">
            <Button className="bg-gray-200 text-black hover:bg-gray-300 transition-colors">
              <Link href="/">{t("home")}</Link>
            </Button>
            <Button
              className=" bg-primary text-white hover:bg-black transition-colors"
              asChild
            >
              <Link
                href={{
                  pathname: "/account/resend-activation",
                  query: {
                    email: responseError.email,
                    callbackUrl: callbackUrl,
                  },
                }}
              >
                {t("activateAccount")}
              </Link>
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { getUserProfileSchema, UserProfileFormData } from "@/schema";
import { updateProfile } from "@/actions/update-profile";
import { useTranslations } from "next-intl"; // assuming next-intl or similar

type ErrorType = {
  message: string;
  first_name?: string;
  last_name?: string;
};

interface UserProfileFormProps {
  initialData: {
    firstName?: string;
    lastName?: string;
    phoneNumber?: string | null;
    newsletter?: boolean;
  } | null;
  accessToken: string | undefined;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function UserProfileForm({
  initialData,
  onSuccess,
  onCancel,
}: UserProfileFormProps) {
  const t = useTranslations("userProfileForm");
  const schemaTranslations = useTranslations("schemaTranslations");
  const UserProfileSchema = getUserProfileSchema(schemaTranslations);

  const form = useForm<UserProfileFormData>({
    resolver: zodResolver(UserProfileSchema),
    defaultValues: {
      first_name: initialData?.firstName || "",
      last_name: initialData?.lastName || "",
      phone_number: initialData?.phoneNumber || "",
      newsletter: initialData?.newsletter || false,
    },
  });

  const [error, setError] = useState<ErrorType | undefined>({
    message: "",
    first_name: "",
    last_name: "",
  });

  const [isPending, startTransition] = useTransition();

  const onSubmit = (values: z.infer<typeof UserProfileSchema>) => {
    setError({
      message: "",
      first_name: "",
      last_name: "",
    });

    startTransition(() => {
      updateProfile(values).then((data) => {
        if (data.success) {
          toast.success(t("profileUpdated"), {
            description: t("profileUpdatedDescription"),
          });
        }

        if (data.error?.message) {
          toast.error(data.error.message);
        }
        setError(data.error);
      });

      onSuccess?.();
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 mt-4">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="first_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("firstName")}</FormLabel>
                <FormControl>
                  <Input
                    placeholder={t("firstNamePlaceholder")}
                    {...field}
                    disabled={isPending}
                  />
                </FormControl>
                <FormDescription className="sr-only">
                  {t("firstNameDescription")}
                </FormDescription>
                <FormMessage />
                {error?.first_name && (
                  <p className="text-sm font-medium text-destructive">
                    {error.first_name}
                  </p>
                )}
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="last_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("lastName")}</FormLabel>
                <FormControl>
                  <Input
                    placeholder={t("lastNamePlaceholder")}
                    {...field}
                    disabled={isPending}
                  />
                </FormControl>
                <FormDescription className="sr-only">
                  {t("lastNameDescription")}
                </FormDescription>
                <FormMessage />
                {error?.last_name && (
                  <p className="text-sm font-medium text-destructive">
                    {error.last_name}
                  </p>
                )}
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="phone_number"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("phoneNumber")}</FormLabel>
              <FormControl>
                <Input
                  placeholder={t("phoneNumberPlaceholder")}
                  {...field}
                  disabled={isPending}
                  type="tel"
                />
              </FormControl>
              <FormDescription className="sr-only">
                {t("phoneNumberDescription")}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-3 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => onCancel?.()}
            disabled={isPending}
          >
            {t("cancel")}
          </Button>
          <Button
            type="submit"
            disabled={isPending}
            className="bg-primary text-white hover:bg-black transition-colors"
          >
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isPending ? t("saving") : t("saveChanges")}
          </Button>
        </div>
      </form>
    </Form>
  );
}

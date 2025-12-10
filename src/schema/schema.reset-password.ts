import * as z from "zod";

export const ResetPasswordFormSchema = z
  .object({
    email: z
      .string()
      .min(1, {
        message: "Email is required",
      })
      .email(),

    token: z.string().min(1, {
      message: "The token sent from the backend is required",
    }),
    password: z
      .string()
      .min(1, {
        message: "Password is required",
      })
      .min(8, {
        message: "Password must be at least 8 characters",
      }),
    password_confirmation: z
      .string()
      .min(1, {
        message: "Password confirmation is required",
      })
      .min(8, {
        message: "Password must be at least 8 characters",
      }),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: "Passwords don't match",
    path: ["password_confirmation"], // This will show the error on the password_confirmation field
  });

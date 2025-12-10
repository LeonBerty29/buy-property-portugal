import { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { LoginRequest, loginUser } from "./data/user";

export default {
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          const loginData: LoginRequest = {
            email: credentials.email as string,
            password: credentials.password as string,
          };

          const response = await loginUser(loginData);

          // console.log({ loginResponse: response });
          // console.log({ data: response.data });

          // console.log({ response });

          if (response.success && response.data?.client && response.data?.token) {
            const user = {
              id: response.data.client.id.toString(),
              email: response.data.client.email,
              name: `${response.data.client.first_name} ${response.data.client.last_name}`,
              firstName: response.data.client.first_name,
              lastName: response.data.client.last_name,
              accessToken: response.data.token,
              reference: response.data.client.reference,
              // user: {
              //   id: response.data.client.id.toString(),
              //   email: response.data.client.email,
              //   name: `${response.data.client.first_name} ${response.data.client.last_name}`,
              //   firstName: response.data.client.first_name,
              //   lastName: response.data.client.last_name,
              //   reference: response.data.client.reference,
              // },
            };

            // console.log({ userInAuthConfig: user });

            return user;
          }

          if (!response.success) {
            throw new Error(response.message || "An Error occured", {
              cause: {
                response: response
              }
            });
          }

          return null;
        } catch (error) {
          console.error("Auth error:", error);
          if (error instanceof Error) {
            throw new Error(error.message || "Authentication failed", {
              cause: error.cause
            });
          }
          return null;
        }
      },
    }),
  ],
} satisfies NextAuthConfig;

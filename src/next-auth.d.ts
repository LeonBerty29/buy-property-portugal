import { type DefaultSession } from "next-auth";
import { DefaultJWT } from "next-auth/jwt"; // Add DefaultJWT import

type ExtendedUser = DefaultSession["user"] & {
  accessToken: string;
  firstName: string;
  lastName: string;
  reference?: string;
};

export interface CustomUser {
  id: string;
  email: string;
  name: string;
  firstName: string;
  lastName: string;
  reference?: string;
}

declare module "next-auth" {
  interface Session {
    user: ExtendedUser;
    accessToken: string;
  }

  interface User {
    id: string;
    email: string;
    name: string;
    accessToken: string;
    firstName: string;
    lastName: string;
    reference?: string;
    user?: {
      id: string;
      email: string;
      name: string;
      firstName: string;
      lastName: string;
      reference?: string;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    accessToken?: string;
    user?: {
      id: string;
      email: string;
      name: string;
      firstName: string;
      lastName: string;
      reference?: string;
    };
  }
}
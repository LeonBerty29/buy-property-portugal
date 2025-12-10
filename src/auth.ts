import NextAuth from "next-auth";
import authConfig from "./auth.config";
// import { CustomUser } from "./next-auth";
import { JWT } from "next-auth/jwt";

export const { handlers, signIn, signOut, auth } = NextAuth({
  callbacks: {
    async jwt({ token, user }) {
      // If user is signing in, add the access token to the JWT

      if (user) {
        // console.log({ user });
        token.accessToken = user.accessToken;
        token.user = user;
        // console.log({ token });
      }

      return token;
    },
    async session({ session, token }) {
      // Add the access token and user data to the session

      if (token.accessToken) {
        session.accessToken = token.accessToken as string;
        session.user = {
          ...session.user,
          ...(token.user as JWT["user"]),
        };
      }

      // console.log({ sessionSion: session });
      // console.log({ sessionToken: token });

      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  ...authConfig,
});

// Helper function to get the current user from session
// export async function getCurrentUser(): Promise<User | null> {
//   const session = await auth();

//   if (!session?.accessToken) {
//     return null;
//   }

//   try {
//     const response = await getUserProfile((session as any).accessToken);
//     return response.client;
//   } catch (error) {
//     console.error("Failed to get current user:", error);
//     return null;
//   }
// }

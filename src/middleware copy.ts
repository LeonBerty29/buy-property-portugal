// import { NextRequest, NextResponse } from "next/server";

// export function middleware(request: NextRequest) {
//   // Get the Basic Auth header
//   const basicAuth = request.headers.get("authorization");

//   if (basicAuth) {
//     // Parse the Basic Auth header
//     const authValue = basicAuth.split(" ")[1];
//     const [user, pwd] = atob(authValue).split(":");

//     // Check credentials (you should use environment variables)
//     const validUser = process.env.BASIC_AUTH_USER || "admin";
//     const validPassword = process.env.BASIC_AUTH_PASSWORD || "password123";

//     if (user === validUser && pwd === validPassword) {
//       // Authentication successful, continue to the page
//       return NextResponse.next();
//     }
//   }

//   // Authentication failed or missing, return 401 with Basic Auth challenge
//   return new NextResponse("Authentication required", {
//     status: 401,
//     headers: {
//       "WWW-Authenticate": 'Basic realm="Secure Area"',
//     },
//   });
// }

// // Apply middleware to all routes
// export const config = {
//   matcher: [
//     /*
//      * Match all request paths except for the ones starting with:
//      * - api (API routes)
//      * - _next/static (static files)
//      * - _next/image (image optimization files)
//      * - favicon.ico (favicon file)
//      */
//     "/((?!api|_next/static|_next/image|favicon.ico).*)",
//   ],
// };

import authConfig from "./auth.config";
import NextAuth from "next-auth";

import {
  DEFAULT_LOGIN_REDIRECT,
  apiAuthPrefix,
  authRoutes,
  privateRoutes,
} from "./routes";
import { NextResponse } from "next/server";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;

  // console.log("Path: ", nextUrl.pathname)
  // console.log("LoggedIN: ", isLoggedIn)

  const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
  const isPublicRoute = !(privateRoutes.includes(nextUrl.pathname));
  const isAuthRoute = authRoutes.includes(nextUrl.pathname);

  const basicAuth = req.headers.get("authorization");

  if (!basicAuth) {
    return new NextResponse("Authentication required", {
      status: 401,
      headers: {
        "WWW-Authenticate": 'Basic realm="Secure Area"',
      },
    });
  }

  if (basicAuth) {
    // Parse the Basic Auth header
    const authValue = basicAuth.split(" ")[1];
    const [user, pwd] = atob(authValue).split(":");

    // Check credentials (you should use environment variables)
    const validUser = process.env.BASIC_AUTH_USER || "admin";
    const validPassword = process.env.BASIC_AUTH_PASSWORD || "password123";

    if (user === validUser && pwd === validPassword) {
      // Authentication successful, continue to the page
      if (isApiAuthRoute) {
        return;
      }

      if (isAuthRoute) {
        if (isLoggedIn) {
          return NextResponse.redirect(
            new URL(DEFAULT_LOGIN_REDIRECT, nextUrl)
          );
        }
        return;
      }

      if (!isLoggedIn && !isPublicRoute) {
        const loginUrl = new URL("/login", nextUrl);
        // Add ?from=/incoming-url to the /login URL
        loginUrl.searchParams.set("callbackUrl", nextUrl.pathname);
        return NextResponse.redirect(new URL(loginUrl));

        // return NextResponse.redirect(new URL("http://localhost:3000/auth/login", nextUrl))
      }
      return NextResponse.next();
    }
  }

  return;
});

// Optionally, don't invoke Middleware on some parts

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};

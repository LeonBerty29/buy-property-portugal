"use client";

import { useSession } from "next-auth/react";
import { useEffect, useRef, useState } from "react";
import { Loader2 } from "lucide-react";
import { validateAndRefreshSession } from "@/actions/token-validity";

interface SessionValidatorProps {
  children: React.ReactNode;
}

export function SessionValidator({ children }: SessionValidatorProps) {
  const { data: session, update, status } = useSession();
  const hasValidated = useRef(false);
  const [isValidating, setIsValidating] = useState(false);

  useEffect(() => {
    const validateSession = async () => {
      // Only validate once per mount and only if we have a token
      if (hasValidated.current || !session?.accessToken) {
        return;
      }

      hasValidated.current = true;
      setIsValidating(true);

      try {
        const result = await validateAndRefreshSession(session.accessToken);

        if (result.expired) {
          // Update the session to null on the client side
          await update(null);
          console.log("Session expired and cleared on client");
        }
      } catch (error) {
        console.error("Session validation error:", error);
      } finally {
        setIsValidating(false);
      }
    };

    validateSession();
  }, [session?.accessToken, update]);

  // Show loader while session is loading or validating
  if (status === "loading" || isValidating) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

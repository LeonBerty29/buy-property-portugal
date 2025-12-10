"use client"

import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";
import { BackButton } from "./back-button";
import { Header } from "./header";
import { Social } from "./social";

interface CardWrapperProps {
  children: React.ReactNode;
  headerLabel: string;
  backButtonLabel: string;
  backButtonHref: string;
  showSocial?: boolean
}


export const CardWrapper = ({
  children,
  headerLabel,
  backButtonLabel,
  backButtonHref,
  showSocial
}: CardWrapperProps) => {

  return (
    <Card className="min-w-[90%] sm:min-w-[400px] md:w-lg shadow-md px-6 py-10 md:px-12">
      <CardHeader>
        <Header label={headerLabel} />
      </CardHeader>
      <CardContent className="px-0">
        {children}
      </CardContent>

      {
        showSocial && (
          <CardFooter className="px-0">
            <Social />
          </CardFooter>
        )
      }

      <CardFooter className="px-0 border-t">
        <BackButton href={backButtonHref} label={backButtonLabel} />
      </CardFooter>
    </Card>
  )
}
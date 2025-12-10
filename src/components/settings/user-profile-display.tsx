"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { UserProfileForm } from "./user-profile-form";
import { Edit, User, Phone } from "lucide-react";
import { useTranslations } from "next-intl";

interface UserProfileDisplayProps {
  userProfile: {
    firstName?: string;
    lastName?: string;
    phoneNumber?: string | null | undefined;
    newsletter?: boolean;
  } | null;
  accessToken: string | undefined;
}

export function UserProfileDisplay({
  userProfile,
  accessToken,
}: UserProfileDisplayProps) {
  const t = useTranslations("userProfileDisplay");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleCancel = () => {
    setIsDialogOpen(false);
  };

  const handleFormSuccess = () => {
    setIsDialogOpen(false);
    // Optionally trigger a page refresh or update local state
    // window.location.reload();
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between w-full">
        <div>
          <CardTitle className="text-3xl text-primary tracking-tight">
            {t("profileInformation")}
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            {t("yourPersonalInformationAndContactDetails")}
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2">
              <Edit className="h-4 w-4" />
              {t("editProfile")}
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[525px]">
            <DialogHeader>
              <DialogTitle className="text-2xl">
                {t("editProfileDialogTitle")}
              </DialogTitle>
              <DialogDescription>
                {t("editProfileDialogDescription")}
              </DialogDescription>
            </DialogHeader>
            <UserProfileForm
              initialData={userProfile}
              accessToken={accessToken}
              onSuccess={handleFormSuccess}
              onCancel={handleCancel}
            />
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <User className="h-4 w-4" />
                {t("firstName")}
              </div>
              <div className="text-lg font-medium">
                {userProfile?.firstName || t("emptyValuePlaceholder")}
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <User className="h-4 w-4" />
                {t("lastName")}
              </div>
              <div className="text-lg font-medium">
                {userProfile?.lastName || t("emptyValuePlaceholder")}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <Phone className="h-4 w-4" />
              {t("phoneNumber")}
            </div>
            <div className="text-lg font-medium">
              {userProfile?.phoneNumber || t("emptyValuePlaceholder")}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
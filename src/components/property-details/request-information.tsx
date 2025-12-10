"use client";
import React from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { LiaEdit } from "react-icons/lia";
import { Button } from "../ui/button";
import { Property } from "@/types/property";
import ContactAgentForm from "./contact-agent-form";
import { CheckCircle } from "lucide-react";
import { useTranslations } from "next-intl";

interface RequestInformationDialogProps {
  salesConsultant: Property["sales_consultant"];
  children?: React.ReactNode;
}

export const RequestInformationDialog: React.FC<
  RequestInformationDialogProps
> = ({ salesConsultant, children }) => {
  const t = useTranslations("requestInformation");
  const [isOpen, setIsOpen] = React.useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = React.useState(false);

  const handleSuccess = () => {
    setIsOpen(false);
    setShowSuccessDialog(true);
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          {children || (
            <Button
              type="button"
              className="text-sm font-semibold w-full rounded-none bg-white text-black !px-6 hover:text-white hover:bg-black transition-all"
            >
              <LiaEdit className="h-3 w-3" />
              {t("requestInformationButton")}
            </Button>
          )}
        </DialogTrigger>
        <DialogContent
          showCloseButton={true}
          closeButtonStyles="bg-white"
          className="border-primary h-full overflow-y-auto bg-black sm:max-w-md max-h-[90vh]"
        >
          <div>
            <DialogHeader>
              <DialogTitle className="text-white text-center">
                {t("contactSalesConsultant")}
              </DialogTitle>
            </DialogHeader>
            <div className="px-2 py-4">
              <ContactAgentForm
                salesConsultant={salesConsultant}
                onSuccess={handleSuccess}
              />
            </div>
          </div>

          <DialogFooter className="sm:justify-start">
            <DialogClose asChild>
              <Button
                type="button"
                className="bg-transparent border border-white hover:bg-primary hover:border-primary text-white px-8"
              >
                {t("close")}
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Success Dialog */}
      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent className="sm:max-w-md rounded-2xl">
          <DialogHeader className="text-center">
            <div className="flex justify-center mb-4">
              <CheckCircle className="h-16 w-16 text-green-500" />
            </div>
            <DialogTitle className="text-xl text-center">
              {t("requestSubmittedSuccessfully")}
            </DialogTitle>
          </DialogHeader>

          <div className="text-center space-y-4">
            <p className="text-gray-600">{t("thankYouMessage")}</p>
          </div>

          <div className="flex justify-center pt-4 mb-2">
            <Button
              onClick={() => setShowSuccessDialog(false)}
              className="bg-primary text-white hover:bg-black transition-colors"
            >
              {t("close")}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Mail, Phone, PhoneIncoming } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { renderRichText } from "@storyblok/react";
import { Separator } from "../ui/separator";
import {
  TeamMemberDialogProps,
  TeamMember,
  TeamMembersProps,
} from "@/types/team";
import { useTranslations } from "next-intl";

// Dialog Component for Mobile
const TeamMemberDialog: React.FC<TeamMemberDialogProps> = ({
  member,
  isOpen,
  onClose,
}) => {
  if (!member) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="bg-white overflow-hidden">
          <DialogHeader className="text-left">
            <div className="relative">
              <Image
                src={`https:${member.content.image}`}
                alt={member.name}
                width={600}
                height={400}
                className="w-full h-96 object-cover "
                priority
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-8">
                <DialogTitle>
                  <span className="text-2xl font-bold text-white mb-2">
                    {member.content.name}
                  </span>
                </DialogTitle>
                <DialogDescription>
                  <span className="text-base text-white/80 font-medium">
                    {member.content.role}
                  </span>
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="py-4">
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <Mail className="w-6 h-6 text-primary" />
                <a
                  href={`mailto:${member.content.email}`}
                  className="text-primary hover:underline text-lg"
                  aria-label={`Email ${member.name}`}
                >
                  {member.content.email}
                </a>
              </div>
              <div className="flex items-center space-x-4">
                <Phone className="w-6 h-6 text-green-600" />
                <a
                  href={`tel:${member.content.mobile}`}
                  className="text-gray-700 text-lg"
                  aria-label={`Call ${member.name}`}
                >
                  {member.content.mobile}
                </a>
              </div>
              <div className="flex items-center space-x-4">
                <PhoneIncoming className="w-6 h-6 text-primary" />
                <span className="text-gray-700 text-lg">
                  {member.content.office}
                </span>
              </div>

              {member.content.details && (
                <div className="flex items-center space-x-4">
                  <div
                    className="prose md:prose-base max-w-none"
                    dangerouslySetInnerHTML={{
                      __html: renderRichText(member.content.details)!,
                    }}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const TeamMembers: React.FC<TeamMembersProps> = ({ teams }) => {
  const t = useTranslations("teamMembers");
  const [selectedMember, setSelectedMember] = useState<TeamMember>(
    teams![0].data![0]
  );
  const [isMobileDialogOpen, setIsMobileDialogOpen] = useState<boolean>(false);
  const [mobileSelectedMember, setMobileSelectedMember] =
    useState<TeamMember | null>(null);

  const handleMemberSelect = (member: TeamMember): void => {
    setSelectedMember(member);
  };

  const handleMobileDetailsClick = (member: TeamMember): void => {
    setMobileSelectedMember(member);
    setIsMobileDialogOpen(true);
  };

  const closeMobileDialog = (): void => {
    setIsMobileDialogOpen(false);
    setMobileSelectedMember(null);
  };

  if (!teams?.length) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            {t("noteamMambers")}
          </h2>
          <p className="text-gray-600">{t("addTeamMembers")}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {t("meetTheTeam")}
          </h1>
          <div className="w-24 h-1 bg-primary mx-auto"></div>
          <p className="mb-6 text-gray-600 mt-6">{t("clickOnATeamMember")}</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left side - Member Details (Desktop only) */}
          <div className="hidden lg:block lg:w-1/2 max-w-xl sticky top-16 bottom-0 h-fit">
            <div className="bg-white overflow-hidden overflow-y-auto max-h-screen custom-scrollbar pb-16">
              <div className="relative">
                <Image
                  src={`https:${selectedMember.content.image}`}
                  alt={selectedMember.content.name}
                  width={600}
                  height={400}
                  className="w-full h-96 object-cover "
                  priority
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-8">
                  <h2 className="text-2xl font-bold text-white mb-2">
                    {selectedMember.content.name}
                  </h2>
                  <p className="text-base text-white/80 font-medium">
                    {selectedMember.content.role}
                  </p>
                </div>
              </div>

              <div className="py-4">
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <Mail className="w-6 h-6 text-primary" />
                    <a
                      href={`mailto:${selectedMember.content.email}`}
                      className="text-primary hover:underline text-lg"
                      aria-label={`Email ${selectedMember.name}`}
                    >
                      {selectedMember.content.email}
                    </a>
                  </div>
                  <div className="flex items-center space-x-4">
                    <Phone className="w-6 h-6 text-green-600" />
                    <a
                      href={`tel:${selectedMember.content.mobile}`}
                      className="text-gray-700 text-lg"
                      aria-label={`Call ${selectedMember.name}`}
                    >
                      {selectedMember.content.mobile}
                    </a>
                  </div>
                  <div className="flex items-center space-x-4">
                    <PhoneIncoming className="w-6 h-6 text-primary" />
                    <span className="text-gray-700 text-lg">
                      {selectedMember.content.office}
                    </span>
                  </div>

                  {selectedMember.content.details && (
                    <div className="flex items-center space-x-4">
                      <div
                        className="prose md:prose-base max-w-none"
                        dangerouslySetInnerHTML={{
                          __html: renderRichText(
                            selectedMember.content.details
                          )!,
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right side - Team Grid */}
          <div className="flex-1">
            {teams?.map((team, index) => (
              <div className="" key={`team-${index}`}>
                <h3 className="text-xl lg:text-3xl font-normal mb-1 text-gray-600">
                  {team.title}
                </h3>
                <Separator className="mb-8 text-gray-600" />
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-20">
                  {team.data!.map((member) => (
                    <div
                      key={member.id}
                      onClick={() => handleMemberSelect(member)}
                      aria-label={`View details for ${member.content.name}`}
                      className={`relative group cursor-pointer overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 ${
                        selectedMember.id === member.id
                          ? "ring-4 ring-primary ring-opacity-50"
                          : ""
                      }`}
                    >
                      <div className="aspect-[3/4] relative">
                        <Image
                          src={`https:${member.content.image}`}
                          alt={member.name}
                          width={400}
                          height={533}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 "
                        />

                        {/* Glass-like overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300">
                          <div className="absolute bottom-0 left-0 right-0 p-2">
                            <div className="backdrop-blur-sm bg-black/30 rounded-lg p-2 border border-white/20 space-y-1.5">
                              <h3 className="text-white font-bold text-sm line-clamp-1">
                                {member.name}
                              </h3>
                              <p className="text-white/90 text-xs font-light line-clamp-1">
                                {member.content.role}
                              </p>

                              {/* Desktop button */}
                              {/* <Button
                            onClick={() => handleMemberSelect(member)}
                            className="hidden lg:inline-flex bg-primary hover:bg-primary/80 text-white px-4 py-2 text-sm font-medium"
                            size="sm"
                            aria-label={`View details for ${member.name}`}
                          >
                            See Details
                          </Button> */}

                              {/* Mobile button */}
                              <Button
                                onClick={() => handleMobileDetailsClick(member)}
                                className="lg:hidden bg-primary hover:bg-primary/80 text-white px-4 py-2 text-xs font-medium"
                                size="sm"
                                aria-label={`View details for ${member.name}`}
                              >
                                {t("seeDetails")}
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile Dialog */}
      <TeamMemberDialog
        member={mobileSelectedMember}
        isOpen={isMobileDialogOpen}
        onClose={closeMobileDialog}
      />
    </div>
  );
};

export default TeamMembers;

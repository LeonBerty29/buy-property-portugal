import { StoryblokRichTextNode } from "@storyblok/react";

export interface Team {
  title: string;
  data: TeamMember[];
}

export interface TeamMember {
  name: string;
  id: number;
  uuid: string;
  content: {
    name: string;
    role: string;
    email: string;
    mobile: string;
    office: string;
    image: string;
    languages: string;
    details: StoryblokRichTextNode<string | TrustedHTML>;
  };
}

export interface TeamMemberDialogProps {
  member: TeamMember | null;
  isOpen: boolean;
  onClose: () => void;
}

export interface TeamMembersProps {
  teams?: Team[];
}

import { cn } from "@/lib/utils";
import { ContactForm } from "./contact-form";
import Image from "next/image";
import { getTranslations } from "next-intl/server";

interface ContactSectionProps {
    theme?: 'dark' | 'light';
    backgroundColor?: string;
    title?: string;
    description?: string;
    imageSrc?: string;
    imageAlt?: string;
    highlightText?: string;
    formTitle?: boolean;    
}

export async function ContactSection({
    theme = 'dark',
    backgroundColor,
    title,
    description,
    imageSrc = '/images/team/team-image.jpg',
    imageAlt,
    highlightText,
    formTitle = true
}: ContactSectionProps) {
    const t = await getTranslations("contactSection");

    // Theme-based text colors
    const headingColor = theme === 'dark' ? 'text-primary' : 'text-black';
    const mutedTextColor = theme === 'dark' ? 'text-white/70' : 'text-black/70';
    const highlightColor = theme === 'dark' ? 'text-white' : 'text-black';

    const finalTitle = title || t("defaultTitle");
    const finalDescription = description || t("defaultDescription");
    const finalImageAlt = imageAlt || t("defaultImageAlt");
    const finalHighlightText = highlightText || t("defaultHighlightText");

    return (
        <div className={cn(backgroundColor ? backgroundColor : theme == "dark" ? "bg-neutral-800" : "bg-white")}>
            <div className='lg:container mx-auto px-6 md:px-12 lg:px-14 py-14'>
                <div className='flex items-center gap-6 justify-between py-5 md:py-8 flex-wrap'>
                    <div className='w-full lg:w-[47%] 2xl:w-[44%]'>
                        <h2 className={`text-xl lg:text-2xl sm:max-w-70 mb-6 font-semibold ${headingColor}`}>
                            {finalTitle}
                        </h2>

                        {imageSrc &&
                            (
                                <div className='relative h-70 w-[85%] mb-7'>
                                    <Image
                                        src={imageSrc}
                                        alt={finalImageAlt}
                                        fill
                                        className='w-full h-full object-cover'
                                        priority
                                    />
                                </div>
                            )
                        }

                        <p className={`${mutedTextColor} text-sm xl:text-base mb-5`}>
                            {finalDescription.split(finalHighlightText)[0]}
                            <span className={highlightColor}>{finalHighlightText}</span>
                            {finalDescription.split(finalHighlightText)[1]}
                        </p>
                    </div>

                    <div className='w-full lg:w-[47%] 2xl:w-[44%] flex justify-end'>
                        <ContactForm theme={theme} formTitle={formTitle} />
                    </div>
                </div>
            </div>
        </div>
    );
}
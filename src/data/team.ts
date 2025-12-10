import { getStoryblokApi } from "@/lib/storyblok";
import { getTranslations } from "next-intl/server";

export const fetchTeam = async ({
  per_page,
  page,
  tag,
  sort_by,
  language,
}: {
  per_page?: number;
  page?: number;
  tag?: string;
  sort_by?: string;
  language?: string;
}) => {
  const t = await getTranslations("teamData");
  const client = getStoryblokApi();
  const withTag = tag ? { with_tag: tag } : {};
  const sortBy = sort_by ? { sort_by: sort_by } : {};

  try {
    const requests = [
      client.getStories({
        content_type: "teamMembers",
        starts_with: `team/algarve/${language}`,
        version: process.env.NODE_ENV === "development" ? "draft" : "published",
        per_page: per_page || 10,
        page: page || 1,
        ...withTag,
        ...sortBy,
      }),
      client.getStories({
        content_type: "teamMembers",
        starts_with: `team/carvoeiro/${language}`,
        version: process.env.NODE_ENV === "development" ? "draft" : "published",
        per_page: per_page || 10,
        page: page || 1,
        ...withTag,
        ...sortBy,
      }),
      client.getStories({
        content_type: "teamMembers",
        starts_with: `team/lagos/${language}`,
        version: process.env.NODE_ENV === "development" ? "draft" : "published",
        per_page: per_page || 10,
        page: page || 1,
        ...withTag,
        ...sortBy,
      }),
      client.getStories({
        content_type: "teamMembers",
        starts_with: `team/vilamoura/${language}`,
        version: process.env.NODE_ENV === "development" ? "draft" : "published",
        per_page: per_page || 10,
        page: page || 1,
        ...withTag,
        ...sortBy,
      }),
      client.getStories({
        content_type: "teamMembers",
        starts_with: `team/belgium/${language}`,
        version: process.env.NODE_ENV === "development" ? "draft" : "published",
        per_page: per_page || 10,
        page: page || 1,
        ...withTag,
        ...sortBy,
      }),
    ];

    const [
      responseAlgarve,
      responseCarvoeiro,
      responseLagos,
      responseVilamoura,
      responseBelgium,
    ] = await Promise.all(requests);

    return [
      {
        title: t("teamInAlgarve"),
        data: responseAlgarve.data.stories,
      },
      {
        title: t("teamInCarvoeiro"),
        data: responseCarvoeiro.data.stories,
      },
      {
        title: t("teamInLagos"),
        data: responseLagos.data.stories,
      },
      {
        title: t("teamInVilamoura"),
        data: responseVilamoura.data.stories,
      },
      {
        title: t("teamInBelgium"),
        data: responseBelgium.data.stories,
      },
    ];
  } catch (error: unknown) {
    console.log(error);

    if (error instanceof Error) {
      throw error;
    } else {
      throw new Error(`${t("failedToFetchTeam")} ${String(error)}`);
    }
  }
};

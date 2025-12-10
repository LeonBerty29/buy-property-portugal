import { getStoryblokApi } from "@/lib/storyblok";
import { StoryblokError } from "@/types";
import { notFound } from "next/navigation";

export const fetchAllBlogs = async ({
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
  language: string;
}) => {
  const client = getStoryblokApi();
  const withTag = tag ? { with_tag: tag } : {};
  const sortBy = sort_by ? { sort_by: sort_by } : {};
  try {
    const response = await client.getStories({
      content_type: "blog",
      version: process.env.NODE_ENV === "development" ? "draft" : "published",
      per_page: per_page || 10,
      page: page || 1,
      starts_with: `blogs/${language}`,
      ...withTag,
      ...sortBy
    });

    return response;
  } catch (error: unknown) {
    console.log(error);

    if (error instanceof Error) {
      throw error;
    } else {
      throw new Error(`Failed to fetch blog page: ${String(error)}`);
    }
  }
};

export const fetchBlogPage = async (slug: string, language: string) => {
  // Helper function to get error status

  const getErrorStatus = (error: unknown): number | undefined => {
    if (isStoryblokError(error)) {
      return error.status || error.response?.status;
    }
    return undefined;
  };

  // Type guard to check if error is a Storyblok error
  const isStoryblokError = (error: unknown): error is StoryblokError => {
    return (
      typeof error === "object" &&
      error !== null &&
      ("status" in error ||
        ("response" in error &&
          typeof (error as Record<string, unknown>).response === "object" &&
          (error as Record<string, unknown>).response !== null &&
          "status" in
            ((error as Record<string, unknown>).response as Record<
              string,
              unknown
            >)))
    );
  };

  const client = getStoryblokApi();
  try {
    const response = await client.getStory(`blogs/${language}/${slug}`, {
      version: process.env.NODE_ENV === "development" ? "draft" : "published",
    });
    return response.data.story;
  } catch (error: unknown) {
    const errorStatus = getErrorStatus(error);

    if (errorStatus === 404) {
      notFound();
    }
    console.log(error);

    // Re-throw the error with proper typing
    if (error instanceof Error) {
      throw error;
    } else {
      throw new Error(`Failed to fetch blog page: ${String(error)}`);
    }
  }
};

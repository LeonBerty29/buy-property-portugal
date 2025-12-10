import { fetchSellResources } from "@/data/resources";
import { getLocale } from "next-intl/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {

    const { searchParams } = new URL(request.url);
    const locale = searchParams.get('locale') || await getLocale();
    
    const response = await fetchSellResources({language: locale});
    const data = response.data.stories;

    return NextResponse.json(data);
  } catch (error) {
    console.error(
      "Error stack:",
      error instanceof Error ? error.stack : "No stack trace"
    );
    // console.error("=== END CRITICAL ERROR ===");

    return NextResponse.json(
      {
        error: "Internal server error Error fetching sell resources",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

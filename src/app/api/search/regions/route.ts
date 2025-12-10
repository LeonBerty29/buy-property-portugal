import { getMetadata } from "@/data/properties-metada";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const metadata = await getMetadata();
    const data = metadata.areas;

    return NextResponse.json(data);
  } catch (error) {
    console.error(
      "Error stack:",
      error instanceof Error ? error.stack : "No stack trace"
    );
    // console.error("=== END CRITICAL ERROR ===");

    return NextResponse.json(
      {
        error: "Internal server error Error fetching Regions",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

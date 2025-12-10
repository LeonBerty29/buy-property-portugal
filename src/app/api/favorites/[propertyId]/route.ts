import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ propertyId: string }> }
) {
  try {
    const session = await auth();
    const token = session?.accessToken;

    if (!token) {
      return NextResponse.json(
        { error: "Authentication required - no access token" },
        { status: 401 }
      );
    }

    const { propertyId: propertyIdParam } = await params;
    const propertyId = parseInt(propertyIdParam);

    if (isNaN(propertyId)) {
      return NextResponse.json(
        { error: "Invalid property ID" },
        { status: 400 }
      );
    }

    const apiBaseUrl =
      process.env.API_BASE_URL || process.env.NEXT_PUBLIC_API_BASE_URL;

    if (!apiBaseUrl) {
      return NextResponse.json(
        { error: "API configuration error" },
        { status: 500 }
      );
    }

    const endpoint = `/v1/client/favorites/${propertyId}`;
    const url = `${apiBaseUrl}${endpoint}`;

    const response = await fetch(url, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      let errorText = "";

      try {
        errorText = await response.text();
      } catch (textError) {
        console.log("Could not read error response body:", textError);
      }

      return NextResponse.json(
        {
          error: `Failed to remove favorite: ${response.statusText}`,
          details: errorText,
        },
        { status: response.status }
      );
    }

    // Handle 204 No Content response (successful deletion with no body)
    if (response.status === 204) {
      return new NextResponse(null, { status: 204 });
    }

    // For other successful responses, try to parse JSON
    let result = null;
    const contentType = response.headers.get("content-type");

    if (contentType && contentType.includes("application/json")) {
      try {
        result = await response.json();
      } catch (jsonError) {
        console.log("Could not parse JSON response:", jsonError);
      }
    }

    return NextResponse.json(result || { success: true });
  } catch (error) {
    console.error(
      "Error stack:",
      error instanceof Error ? error.stack : "No stack trace"
    );

    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

import { RegisterRequest, registerUser } from "@/data/user";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body: RegisterRequest = await request.json();

    // Validate required fields
    if (!body.email || !body.password || !body.first_name || !body.last_name) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Validate password confirmation
    if (body.password !== body.password_confirmation) {
      return NextResponse.json(
        { message: "Passwords do not match" },
        { status: 400 }
      );
    }

    const response = await registerUser(body);

    return NextResponse.json(response, { status: 201 });
  } catch (error: unknown) {
    console.error("Registration error:", error);

    const errorMessage =
      error instanceof Error ? error.message : "Registration failed";

    return NextResponse.json({ message: errorMessage }, { status: 400 });
  }
}

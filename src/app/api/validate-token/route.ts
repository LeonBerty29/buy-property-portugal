import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { ValidateToken } from "@/data/token";

export async function GET() {
  try {
    const session = await auth();
    const token = session?.accessToken;

    if (!token) {
      return NextResponse.json({ valid: false, logout: true }, { status: 401 });
    }

    const result = await ValidateToken(token);

    return NextResponse.json(result);
  } catch (error) {
    console.error("Token validation error:", error);
    return NextResponse.json({ valid: false, logout: false }, { status: 500 });
  }
}

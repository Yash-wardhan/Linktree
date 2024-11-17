import { NextResponse } from "next/server";
import { serialize } from "cookie";

export async function POST() {
  const headers = new Headers();

  // Clear the authentication cookie
  headers.append(
    "Set-Cookie",
    serialize("token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 0, // Expire immediately
    })
  );

  return NextResponse.json(
    { message: "You have been signed out successfully." },
    { headers }
  );
}

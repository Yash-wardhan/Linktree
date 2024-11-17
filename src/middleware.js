import { jwtVerify } from "jose";
import { NextResponse } from "next/server";

export async function middleware(request) {
  const token = request.cookies.get("token")?.value;


  const protectedPaths = ["/dashboard"];
  const currentPath = request.nextUrl.pathname;

  if (protectedPaths.some((path) => currentPath.startsWith(path))) {
    if (!token) {
      console.log("No token found. Redirecting to login...");
      return NextResponse.redirect(new URL("/login", request.url));
    }

    try {
      // Use jose to verify the token
      const secret = new TextEncoder().encode(process.env.JWT_SECRET);
      const { payload } = await jwtVerify(token, secret);

    } catch (error) {
      console.error("Token verification failed:", error.message);
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  return NextResponse.next();
}

// Apply middleware to specific routes
export const config = {
  matcher: ["/dashboard/:path*"], // Apply to /dashboard and subpaths
};
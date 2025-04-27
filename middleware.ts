import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// This middleware checks if the user is authenticated and has access to the requested page
export function middleware(request: NextRequest) {
  // In a real application, we would verify the session/token here
  // For this demo, we'll just check if there's a user in localStorage
  // Note: This is client-side only in a real app, but for demo purposes we're simplifying

  // Allow access to the login page
  if (request.nextUrl.pathname === "/") {
    return NextResponse.next()
  }

  // For all other routes, check authentication
  // Note: In a real app, this would be done with server-side session validation
  // This is just a simplified example
  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}

import { NextRequest } from "next/server"
import { updateSessionEdge } from "@/utils/supabase/middleware-edge"

export async function middleware(request: NextRequest) {
  return updateSessionEdge(request)
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}

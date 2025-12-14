import { auth } from "@/lib/auth"
import { NextResponse } from "next/server"
export default auth((req) => {
    const isLoggedIn = !!req.auth
    const isDashboardRoute = req.nextUrl.pathname.startsWith('/dashboard')
    if (isDashboardRoute && !isLoggedIn) {
        return NextResponse.redirect(new URL('/', req.url))
    }
})
export const config = {
    matcher: ["/dashboard/:path*", "/api/auth/:path*"],
}
/**
 * Miramar Experience - Authentication Middleware
 * Protects /admin routes
 */

import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
    // Check if Supabase is configured
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    // If Supabase is not configured, allow access to public routes but block admin
    if (!supabaseUrl || !supabaseKey) {
        const isProtectedRoute = request.nextUrl.pathname.startsWith('/admin');

        if (isProtectedRoute) {
            // Redirect to home with a message
            const url = new URL('/', request.url);
            url.searchParams.set('error', 'supabase_not_configured');
            return NextResponse.redirect(url);
        }

        // Allow public routes without Supabase
        return NextResponse.next();
    }

    let supabaseResponse = NextResponse.next({
        request,
    });

    const supabase = createServerClient(
        supabaseUrl,
        supabaseKey,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll();
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value }) =>
                        request.cookies.set(name, value)
                    );
                    supabaseResponse = NextResponse.next({
                        request,
                    });
                    cookiesToSet.forEach(({ name, value, options }) =>
                        supabaseResponse.cookies.set(name, value, options)
                    );
                },
            },
        }
    );

    // Refresh session
    const {
        data: { user },
    } = await supabase.auth.getUser();

    // Protected routes - require authentication
    const isProtectedRoute = request.nextUrl.pathname.startsWith('/admin');

    if (isProtectedRoute && !user) {
        // Redirect to login page
        const loginUrl = new URL('/login', request.url);
        loginUrl.searchParams.set('redirect', request.nextUrl.pathname);
        return NextResponse.redirect(loginUrl);
    }

    // If user is logged in and tries to access login page, redirect to admin
    const isAuthRoute = request.nextUrl.pathname === '/login';
    if (isAuthRoute && user) {
        return NextResponse.redirect(new URL('/admin', request.url));
    }

    return supabaseResponse;
}

export const config = {
    matcher: [
        /*
         * Match all request paths except:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - public folder
         * - api routes
         */
        '/((?!_next/static|_next/image|favicon.ico|public|api).*)',
    ],
};

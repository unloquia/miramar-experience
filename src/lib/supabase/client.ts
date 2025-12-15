/**
 * Miramar Experience - Supabase Client Configuration
 * Server-side and Client-side utilities
 */

import { createBrowserClient } from '@supabase/ssr';
import { Database } from '@/types/database';

// Validate environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    console.warn(
        '⚠️ Supabase environment variables not configured. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local'
    );
}

/**
 * Create Supabase client for browser/client components
 */
export function createClient() {
    return createBrowserClient<Database>(
        supabaseUrl || '',
        supabaseAnonKey || ''
    );
}

/**
 * Helper to get public URL for storage items
 */
export function getPublicUrl(bucket: string, path: string): string {
    if (!supabaseUrl) return '';
    return `${supabaseUrl}/storage/v1/object/public/${bucket}/${path}`;
}

/**
 * Storage bucket name for ad images
 */
export const AD_IMAGES_BUCKET = 'ads-images';

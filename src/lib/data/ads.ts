/**
 * Miramar Experience - Data Fetching Functions
 * Server-side queries for ads
 */

import { createServerSupabaseClient } from '@/lib/supabase/server';
import { Ad } from '@/types/database';

/**
 * Check if Supabase is configured
 */
function isSupabaseConfigured(): boolean {
    return !!(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
}

/**
 * Get all active hero tier ads (for carousel)
 * Filters: is_active = true AND expiration_date > NOW()
 */
export async function getHeroAds(): Promise<Ad[]> {
    // Return empty array if Supabase is not configured
    if (!isSupabaseConfigured()) {
        console.warn('⚠️ Supabase not configured - returning empty hero ads');
        return [];
    }

    try {
        const supabase = await createServerSupabaseClient();

        const { data, error } = await supabase
            .from('ads')
            .select('*')
            .eq('tier', 'hero')
            .eq('is_active', true)
            .gt('expiration_date', new Date().toISOString())
            .order('priority', { ascending: false })
            .limit(5); // Máximo 5 hero ads para evitar carousel infinito

        if (error) {
            console.error('Error fetching hero ads:', error);
            return [];
        }

        return data as Ad[];
    } catch (error) {
        console.error('Error in getHeroAds:', error);
        return [];
    }
}

/**
 * Get featured and standard ads for bento grid
 * Filters: is_active = true AND expiration_date > NOW()
 * Order: tier ASC (featured first), then priority DESC
 */
export async function getGridAds(): Promise<Ad[]> {
    // Return empty array if Supabase is not configured
    if (!isSupabaseConfigured()) {
        console.warn('⚠️ Supabase not configured - returning empty grid ads');
        return [];
    }

    try {
        const supabase = await createServerSupabaseClient();

        const { data, error } = await supabase
            .from('ads')
            .select('*')
            .in('tier', ['featured', 'standard'])
            .eq('is_active', true)
            .gt('expiration_date', new Date().toISOString())
            .order('tier', { ascending: true })
            .order('priority', { ascending: false });

        if (error) {
            console.error('Error fetching grid ads:', error);
            return [];
        }

        return data as Ad[];
    } catch (error) {
        console.error('Error in getGridAds:', error);
        return [];
    }
}

/**
 * Get all ads for admin panel (including inactive/expired)
 * Requires authentication - should only be called from protected routes
 */
export async function getAllAdsForAdmin(): Promise<Ad[]> {
    // Return empty array if Supabase is not configured
    if (!isSupabaseConfigured()) {
        console.warn('⚠️ Supabase not configured - returning empty admin ads');
        return [];
    }

    try {
        const supabase = await createServerSupabaseClient();

        // Note: RLS policy allows authenticated users to see all ads
        const { data, error } = await supabase
            .from('ads')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching admin ads:', error);
            return [];
        }

        return data as Ad[];
    } catch (error) {
        console.error('Error in getAllAdsForAdmin:', error);
        return [];
    }
}

/**
 * Get single ad by ID
 */
export async function getAdById(id: string): Promise<Ad | null> {
    // Return null if Supabase is not configured
    if (!isSupabaseConfigured()) {
        return null;
    }

    try {
        const supabase = await createServerSupabaseClient();

        const { data, error } = await supabase
            .from('ads')
            .select('*')
            .eq('id', id)
            .single();

        if (error) {
            console.error('Error fetching ad:', error);
            return null;
        }

        return data as Ad;
    } catch (error) {
        console.error('Error in getAdById:', error);
        return null;
    }
}

/**
 * Get ads by category
 * Filters: is_active = true AND expiration_date > NOW()
 */
export async function getAdsByCategory(category: string): Promise<Ad[]> {
    // Return empty array if Supabase is not configured
    if (!isSupabaseConfigured()) {
        return [];
    }

    try {
        const supabase = await createServerSupabaseClient();

        const { data, error } = await supabase
            .from('ads')
            .select('*')
            .eq('category', category)
            .eq('is_active', true)
            .gt('expiration_date', new Date().toISOString())
            .order('tier', { ascending: true })
            .order('priority', { ascending: false });

        if (error) {
            console.error('Error fetching category ads:', error);
            return [];
        }

        return data as Ad[];
    } catch (error) {
        console.error('Error in getAdsByCategory:', error);
        return [];
    }
}

/**
 * Get all places with geolocation for the map
 * Includes active ads AND permanent places
 */
export async function getPlacesForMap(): Promise<Ad[]> {
    if (!isSupabaseConfigured()) {
        console.warn('⚠️ Supabase not configured - returning empty map places');
        return [];
    }

    try {
        const supabase = await createServerSupabaseClient();

        const { data, error } = await supabase
            .from('ads')
            .select('*')
            .eq('is_active', true)
            .eq('show_on_map', true)
            .not('lat', 'is', null)
            .not('lng', 'is', null)
            .or(`expiration_date.gt.${new Date().toISOString()},is_permanent.eq.true`)
            .order('tier', { ascending: true })
            .order('priority', { ascending: false });

        if (error) {
            console.error('Error fetching map places:', error);
            return [];
        }

        return data as Ad[];
    } catch (error) {
        console.error('Error in getPlacesForMap:', error);
        return [];
    }
}

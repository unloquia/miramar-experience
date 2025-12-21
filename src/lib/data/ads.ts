/**
 * Miramar Experience - Data Fetching Functions
 * Server-side queries for ads
 */

import { createServerSupabaseClient, createPublicSupabaseClient } from '@/lib/supabase/server';
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
    if (!isSupabaseConfigured()) {
        return [];
    }

    try {
        const supabase = createPublicSupabaseClient();

        // Timeout mechanism manual (5s) to prevent Vercel 504s
        const timeoutPromise = new Promise((_, reject) =>
            setTimeout(() => reject(new Error('Timeout fetching hero ads')), 5000)
        );

        const queryPromise = supabase
            .from('ads')
            .select('*')
            .eq('tier', 'hero')
            .eq('is_active', true)
            .gt('expiration_date', new Date().toISOString())
            .order('priority', { ascending: false })
            .limit(5);

        const { data, error } = await Promise.race([queryPromise, timeoutPromise]) as any;

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
    if (!isSupabaseConfigured()) return [];

    try {
        const supabase = createPublicSupabaseClient();

        // Timeout mechanism manual (5s)
        const timeoutPromise = new Promise((_, reject) =>
            setTimeout(() => reject(new Error('Timeout fetching grid ads')), 5000)
        );

        const queryPromise = supabase
            .from('ads')
            .select('*')
            .eq('tier', 'featured') // Home Page es SOLO para Featured (Sponsors)
            .eq('is_active', true)
            .gt('expiration_date', new Date().toISOString())
            .order('priority', { ascending: false }); // Priority decide el orden en home

        const { data, error } = await Promise.race([queryPromise, timeoutPromise]) as any;

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
        const supabase = createPublicSupabaseClient();

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
        const supabase = createPublicSupabaseClient();

        const { data, error } = await supabase
            .from('ads')
            .select('*')
            .eq('category', category)
            .eq('is_active', true)
            .gt('expiration_date', new Date().toISOString());
        // Removemos el order SQL porque el alfabetico de tiers (Featured < Hero) es incorrecto para negocio

        if (error) {
            console.error('Error fetching category ads:', error);
            return [];
        }

        // Manual sort by Tier Importance (Igual que en getAllPlaces)
        const tierWeight = { hero: 3, featured: 2, standard: 1 };
        const sorted = (data as Ad[]).sort((a, b) => {
            // 1. Tier Weight
            const weightA = tierWeight[a.tier] || 0;
            const weightB = tierWeight[b.tier] || 0;
            if (weightA !== weightB) return weightB - weightA;

            // 2. Priority Score (0-100)
            const priorityA = a.priority ?? 0;
            const priorityB = b.priority ?? 0;
            return priorityB - priorityA;
        });

        return sorted;
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
    if (!isSupabaseConfigured()) return [];

    try {
        const supabase = createPublicSupabaseClient();
        const { data, error } = await supabase
            .from('ads')
            .select('*')
            .eq('is_active', true)
            .eq('show_on_map', true)
            .not('lat', 'is', null)
            .not('lng', 'is', null)
            .or(`expiration_date.gt.${new Date().toISOString()},is_permanent.eq.true`)
            .order('tier', { ascending: true })
            .limit(100);

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

/**
 * Get ALL places for the Directory / Guide page
 * Supports filtering by category and search query
 */
export async function getAllPlaces(options?: { category?: string; query?: string }): Promise<Ad[]> {
    if (!isSupabaseConfigured()) return [];

    try {
        const supabase = createPublicSupabaseClient();
        let query = supabase
            .from('ads')
            .select('*')
            .eq('is_active', true)
            .or(`expiration_date.gt.${new Date().toISOString()},is_permanent.eq.true`)
            // Sort: Hero first, then Featured, then Standard
            // Note: Enum order in Supabase might vary, but usually strings are sorted alphabetically if not custom.
            // Ideally we'd map ENUM to INT, but here we rely on Supabase returning them.
            // 'hero' < 'standard' alphabetically? No. 'featured' < 'hero' < 'standard'. 
            // We might need client-side sort if SQL sort isn't perfect, but let's try.
            .order('priority', { ascending: false });

        if (options?.category) {
            query = query.eq('category', options.category);
        }

        if (options?.query) {
            // Busqueda "fuzzy" en nombre O descripcion
            // Nota: La sintaxis de Supabase JS para OR con filtros ilike complejos es un poco verbosa
            // Usamos formato raw string para el OR
            query = query.or(`business_name.ilike.%${options.query}%,description.ilike.%${options.query}%`);
        }

        const { data, error } = await query;

        if (error) {
            console.error('Error fetching directory places:', error);
            return [];
        }

        // Manual sort by Tier Importance to guarantee Business Logic
        const tierWeight = { hero: 3, featured: 2, standard: 1 };
        const sorted = (data as Ad[]).sort((a, b) => {
            const weightA = tierWeight[a.tier] || 0;
            const weightB = tierWeight[b.tier] || 0;
            if (weightA !== weightB) return weightB - weightA; // Higher weight first
            return (b.priority || 0) - (a.priority || 0);
        });

        return sorted;
    } catch (error) {
        console.error('Error in getAllPlaces:', error);
        return [];
    }
}

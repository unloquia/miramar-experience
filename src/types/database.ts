/**
 * Miramar Experience - Database Types
 * Based on Supabase Schema v2.0 with Geolocation
 */

// Ad Tier Enum
export type AdTier = 'hero' | 'featured' | 'standard';

// Ad Category Enum
export type AdCategory = 'gastronomia' | 'hoteleria' | 'shopping' | 'aventura' | 'nocturna';

// Main Ad Type (also represents a Place)
export interface Ad {
    id: string;
    created_at: string;

    // Business Info
    business_name: string;
    description: string | null;
    long_description: string | null;

    // Media
    image_url: string;
    gallery_urls: string[];

    // Contact & Links
    redirect_url: string | null;

    // Classification
    tier: AdTier;
    category: AdCategory;
    priority: number;

    // Geolocation
    lat: number | null;
    lng: number | null;
    address: string | null;
    show_on_map: boolean;

    // Timing & Status
    expiration_date: string;
    is_active: boolean;
    is_permanent: boolean;
}

// For creating a new Ad
export interface CreateAdInput {
    business_name: string;
    description?: string | null;
    long_description?: string | null;
    image_url: string;
    gallery_urls?: string[];
    redirect_url?: string | null;
    tier: AdTier;
    category: AdCategory;
    priority?: number;
    lat?: number | null;
    lng?: number | null;
    address?: string | null;
    show_on_map?: boolean;
    expiration_date: string;
    is_active?: boolean;
    is_permanent?: boolean;
}

// For updating an Ad
export interface UpdateAdInput extends Partial<CreateAdInput> {
    id: string;
}

// User Profile (from Supabase Auth)
export interface UserProfile {
    id: string;
    email: string;
    full_name?: string;
    avatar_url?: string;
}

// Database schema types for Supabase
export interface Database {
    public: {
        Tables: {
            ads: {
                Row: Ad;
                Insert: CreateAdInput;
                Update: Partial<CreateAdInput>;
            };
        };
        Enums: {
            ad_tier: AdTier;
            ad_category: AdCategory;
        };
    };
}

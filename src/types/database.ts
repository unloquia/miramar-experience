/**
 * Miramar Experience - Database Types
 * Based on Supabase Schema v2.0 with Geolocation
 */

// Ad Tier Enum
export type AdTier = 'hero' | 'featured' | 'standard';

// Ad Category Enum
export type AdCategory = 'gastronomia' | 'hoteleria' | 'shopping' | 'aventura' | 'nocturna';

// New Phase 2 Types
export type PriceRange = 'cheap' | 'moderate' | 'expensive' | 'luxury';

export interface DaySchedule {
    open: string;  // "09:00"
    close: string; // "20:00"
    closed: boolean;
}

export interface OpeningHours {
    monday?: DaySchedule;
    tuesday?: DaySchedule;
    wednesday?: DaySchedule;
    thursday?: DaySchedule;
    friday?: DaySchedule;
    saturday?: DaySchedule;
    sunday?: DaySchedule;
    note?: string; // "Feriados consultar"
}

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

    // Contact & Links (Phase 2 Enrichment)
    redirect_url: string | null; // Legacy main link
    phone: string | null;
    instagram_username: string | null;
    website_url: string | null;

    // Classification
    tier: AdTier;
    category: AdCategory;
    priority: number;

    // Phase 2: Metadata
    price_range: PriceRange | null;
    features: string[]; // ['wifi', 'pet_friendly']
    opening_hours: OpeningHours | null;

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

    // New Contact
    phone?: string | null;
    instagram_username?: string | null;
    website_url?: string | null;

    tier: AdTier;
    category: AdCategory;
    priority?: number;

    // New Metadata
    price_range?: PriceRange | null;
    features?: string[];
    opening_hours?: OpeningHours | null;

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
                Row: Ad; // Now includes new fields
                Insert: CreateAdInput; // Now includes new fields
                Update: Partial<CreateAdInput>; // Now includes new fields
            },
            analytics_events: {
                Row: {
                    id: string;
                    ad_id: string;
                    event_type: string;
                    created_at: string;
                    meta: any;
                };
                Insert: {
                    ad_id: string;
                    event_type: string;
                    meta?: any;
                };
                Update: never;
            };
            system_settings: {
                Row: {
                    key: string;
                    value: string;
                    description: string | null;
                    updated_at: string;
                };
                Insert: {
                    key: string;
                    value: string;
                    description?: string | null;
                };
                Update: {
                    value?: string;
                    description?: string | null;
                };
            };
        };
        Enums: {
            ad_tier: AdTier;
            ad_category: AdCategory;
        };
    };
}

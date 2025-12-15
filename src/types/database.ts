/**
 * Miramar Experience - Database Types
 * Based on Supabase Schema from PRD
 */

// Ad Tier Enum
export type AdTier = 'hero' | 'featured' | 'standard';

// Ad Category Enum
export type AdCategory = 'gastronomia' | 'hoteleria' | 'shopping' | 'aventura' | 'nocturna';

// Main Ad Type
export interface Ad {
    id: string;
    created_at: string;
    business_name: string;
    description: string | null;
    image_url: string;
    redirect_url: string | null;
    tier: AdTier;
    category: AdCategory;
    priority: number;
    expiration_date: string;
    is_active: boolean;
}

// For creating a new Ad
export interface CreateAdInput {
    business_name: string;
    description?: string | null;
    image_url: string;
    redirect_url?: string | null;
    tier: AdTier;
    category: AdCategory;
    priority?: number;
    expiration_date: string;
    is_active?: boolean;
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

/**
 * Miramar Experience - Zod Validation Schemas
 * For form validation in Admin Panel
 */

import * as z from 'zod';

// Ad Tier Schema
export const adTierSchema = z.enum(['hero', 'featured', 'standard'], {
    required_error: 'Debes seleccionar un nivel de publicidad',
});

// Ad Category Schema
export const adCategorySchema = z.enum(['gastronomia', 'hoteleria', 'shopping', 'aventura', 'nocturna'], {
    required_error: 'Debes seleccionar una categoría',
});

// Create Ad Form Schema
export const createAdSchema = z.object({
    business_name: z
        .string()
        .min(2, 'El nombre debe tener al menos 2 caracteres')
        .max(100, 'El nombre no puede exceder 100 caracteres'),

    description: z
        .string()
        .max(140, 'La descripción no puede exceder 140 caracteres')
        .optional()
        .nullable(),

    image_url: z
        .string()
        .url('URL de imagen inválida')
        .min(1, 'La imagen es obligatoria'),

    redirect_url: z
        .string()
        .optional()
        .nullable()
        .or(z.literal('')), // Relaxed validation to allow phone numbers (auto-formatted on server)

    tier: adTierSchema,

    category: adCategorySchema,

    long_description: z.string().optional().nullable(),

    // Geolocation
    lat: z.number().nullable().optional(),
    lng: z.number().nullable().optional(),
    address: z.string().nullable().optional(),
    show_on_map: z.boolean().default(true),
    is_permanent: z.boolean().default(false),

    // Gallery
    gallery_urls: z.array(z.string()).optional().default([]),

    priority: z
        .number()
        .int()
        .min(0, 'La prioridad debe ser positiva')
        .max(100, 'La prioridad no puede exceder 100')
        .optional()
        .default(0),

    expiration_date: z
        .string()
        .min(1, 'La fecha de vencimiento es obligatoria')
        .refine((date) => {
            const selected = new Date(date);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            return selected >= today;
        }, 'La fecha de vencimiento debe ser futura'),

    is_active: z.boolean().optional().default(true),
});

// Update Ad Schema (all fields optional except id)
export const updateAdSchema = createAdSchema.partial().extend({
    id: z.string().uuid('ID de anuncio inválido'),
});

// Image Upload Schema
export const imageUploadSchema = z.object({
    file: z
        .instanceof(File)
        .refine((file) => file.size <= 3 * 1024 * 1024, 'La imagen no puede exceder 3MB')
        .refine(
            (file) => ['image/jpeg', 'image/png', 'image/webp'].includes(file.type),
            'Formato de imagen no válido. Usa JPG, PNG o WebP'
        ),
});

// Types inferred from schemas
export type CreateAdFormData = z.infer<typeof createAdSchema>;
export type UpdateAdFormData = z.infer<typeof updateAdSchema>;
export type ImageUploadData = z.infer<typeof imageUploadSchema>;

// Tier display information for UI
export const tierInfo = {
    hero: {
        label: 'Hero',
        description: 'Carrusel principal - Máxima visibilidad (100% width)',
        color: 'bg-amber-500',
        textColor: 'text-amber-500',
    },
    featured: {
        label: 'Destacado',
        description: 'Bento Grid - Posición premium (2 columnas)',
        color: 'bg-primary',
        textColor: 'text-primary',
    },
    standard: {
        label: 'Estándar',
        description: 'Bento Grid - Tarjeta cuadrada (1 columna)',
        color: 'bg-slate-500',
        textColor: 'text-slate-500',
    },
} as const;

// Category display information for UI
export const categoryInfo = {
    gastronomia: {
        label: 'Gastronomía',
        icon: 'restaurant',
    },
    hoteleria: {
        label: 'Hotelería',
        icon: 'hotel',
    },
    shopping: {
        label: 'Shopping',
        icon: 'shopping_bag',
    },
    aventura: {
        label: 'Aventura',
        icon: 'surfing',
    },
    nocturna: {
        label: 'Vida Nocturna',
        icon: 'nightlife',
    },
} as const;

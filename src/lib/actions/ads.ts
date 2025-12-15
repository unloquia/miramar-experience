/**
 * Miramar Experience - Ad Server Actions
 * CRUD operations with revalidation for Next.js cache
 */

'use server';

import { revalidatePath } from 'next/cache';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { CreateAdFormData, UpdateAdFormData, createAdSchema, updateAdSchema } from '@/lib/schemas';
import { Ad } from '@/types/database';

// Response type for actions
type ActionResult<T = void> =
    | { success: true; data: T }
    | { success: false; error: string };

/**
 * Auto-format WhatsApp URLs
 * Converts phone numbers to wa.me links
 */
function formatWhatsAppUrl(url: string | null | undefined): string | null {
    if (!url) return null;

    // If it's just a number (10-15 digits), convert to WhatsApp URL
    const cleanNumber = url.replace(/[\s\-\(\)]/g, '');
    if (/^\d{10,15}$/.test(cleanNumber)) {
        // Add Argentina country code if not present
        const fullNumber = cleanNumber.startsWith('549') ? cleanNumber : `549${cleanNumber}`;
        return `https://wa.me/${fullNumber}`;
    }

    // If it's a wa.me URL without https, add it
    if (url.startsWith('wa.me/')) {
        return `https://${url}`;
    }

    return url;
}

/**
 * Count active hero ads
 */
async function countActiveHeroAds(supabase: Awaited<ReturnType<typeof createServerSupabaseClient>>): Promise<number> {
    const { count, error } = await supabase
        .from('ads')
        .select('*', { count: 'exact', head: true })
        .eq('tier', 'hero')
        .eq('is_active', true)
        .gt('expiration_date', new Date().toISOString());

    if (error) return 0;
    return count || 0;
}

const MAX_HERO_ADS = 5;

/**
 * Create a new ad
 * CRITICAL: Calls revalidatePath after mutation
 */
export async function createAd(formData: CreateAdFormData): Promise<ActionResult<Ad>> {
    try {
        // Validate input
        const validatedData = createAdSchema.parse(formData);

        const supabase = await createServerSupabaseClient();

        // Check authentication
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            return { success: false, error: 'No autorizado' };
        }

        // Check hero ads limit
        if (validatedData.tier === 'hero') {
            const heroCount = await countActiveHeroAds(supabase);
            if (heroCount >= MAX_HERO_ADS) {
                return {
                    success: false,
                    error: `Ya tienes ${MAX_HERO_ADS} ads Hero activos. Desactiva uno o usa Featured.`
                };
            }
        }

        // Auto-format WhatsApp URL
        const redirectUrl = formatWhatsAppUrl(validatedData.redirect_url);

        // Insert ad
        const { data, error } = await supabase
            .from('ads')
            .insert({
                business_name: validatedData.business_name,
                description: validatedData.description || null,
                long_description: validatedData.long_description || null,
                image_url: validatedData.image_url,
                gallery_urls: validatedData.gallery_urls || [],
                redirect_url: redirectUrl,
                tier: validatedData.tier,
                category: validatedData.category,
                priority: validatedData.priority || 0,
                // Geolocation
                lat: validatedData.lat,
                lng: validatedData.lng,
                address: validatedData.address,
                show_on_map: validatedData.show_on_map,
                is_permanent: validatedData.is_permanent,

                expiration_date: validatedData.expiration_date,
                is_active: validatedData.is_active ?? true,
            })
            .select()
            .single();

        if (error) {
            console.error('Error creating ad:', error);
            return { success: false, error: 'Error al crear el anuncio' };
        }

        // CRITICAL: Revalidate cache
        revalidatePath('/');
        revalidatePath('/admin');
        revalidatePath('/admin/ads');

        return { success: true, data: data as Ad };
    } catch (error) {
        console.error('Create ad error:', error);
        return { success: false, error: 'Error de validación' };
    }
}

/**
 * Update an existing ad
 * CRITICAL: Calls revalidatePath after mutation
 */
export async function updateAd(formData: UpdateAdFormData): Promise<ActionResult<Ad>> {
    try {
        // Validate input
        const validatedData = updateAdSchema.parse(formData);

        const supabase = await createServerSupabaseClient();

        // Check authentication
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            return { success: false, error: 'No autorizado' };
        }

        // Build update object (only include defined fields)
        const updateData: Record<string, unknown> = {};
        if (validatedData.business_name !== undefined) updateData.business_name = validatedData.business_name;
        if (validatedData.description !== undefined) updateData.description = validatedData.description;
        if (validatedData.long_description !== undefined) updateData.long_description = validatedData.long_description;
        if (validatedData.image_url !== undefined) updateData.image_url = validatedData.image_url;
        if (validatedData.gallery_urls !== undefined) updateData.gallery_urls = validatedData.gallery_urls;
        if (validatedData.redirect_url !== undefined) updateData.redirect_url = formatWhatsAppUrl(validatedData.redirect_url);
        if (validatedData.tier !== undefined) updateData.tier = validatedData.tier;
        if (validatedData.category !== undefined) updateData.category = validatedData.category;
        if (validatedData.priority !== undefined) updateData.priority = validatedData.priority;

        // Geolocation updates
        if (validatedData.lat !== undefined) updateData.lat = validatedData.lat;
        if (validatedData.lng !== undefined) updateData.lng = validatedData.lng;
        if (validatedData.address !== undefined) updateData.address = validatedData.address;
        if (validatedData.show_on_map !== undefined) updateData.show_on_map = validatedData.show_on_map;
        if (validatedData.is_permanent !== undefined) updateData.is_permanent = validatedData.is_permanent;

        if (validatedData.expiration_date !== undefined) updateData.expiration_date = validatedData.expiration_date;
        if (validatedData.is_active !== undefined) updateData.is_active = validatedData.is_active;

        // Update ad
        const { data, error } = await supabase
            .from('ads')
            .update(updateData)
            .eq('id', validatedData.id)
            .select()
            .single();

        if (error) {
            console.error('Error updating ad:', error);
            return { success: false, error: 'Error al actualizar el anuncio' };
        }

        // CRITICAL: Revalidate cache
        revalidatePath('/');
        revalidatePath('/admin');
        revalidatePath('/admin/ads');

        return { success: true, data: data as Ad };
    } catch (error) {
        console.error('Update ad error:', error);
        return { success: false, error: 'Error de validación' };
    }
}

/**
 * Delete an ad
 * CRITICAL: Calls revalidatePath after mutation
 */
export async function deleteAd(id: string): Promise<ActionResult> {
    try {
        const supabase = await createServerSupabaseClient();

        // Check authentication
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            return { success: false, error: 'No autorizado' };
        }

        // Delete ad
        const { error } = await supabase
            .from('ads')
            .delete()
            .eq('id', id);

        if (error) {
            console.error('Error deleting ad:', error);
            return { success: false, error: 'Error al eliminar el anuncio' };
        }

        // CRITICAL: Revalidate cache
        revalidatePath('/');
        revalidatePath('/admin');
        revalidatePath('/admin/ads');

        return { success: true, data: undefined };
    } catch (error) {
        console.error('Delete ad error:', error);
        return { success: false, error: 'Error al eliminar' };
    }
}

/**
 * Toggle ad active status
 * CRITICAL: Calls revalidatePath after mutation
 */
export async function toggleAdStatus(id: string, isActive: boolean): Promise<ActionResult<Ad>> {
    try {
        const supabase = await createServerSupabaseClient();

        // Check authentication
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            return { success: false, error: 'No autorizado' };
        }

        // Update status
        const { data, error } = await supabase
            .from('ads')
            .update({ is_active: isActive })
            .eq('id', id)
            .select()
            .single();

        if (error) {
            console.error('Error toggling ad status:', error);
            return { success: false, error: 'Error al cambiar estado' };
        }

        // CRITICAL: Revalidate cache
        revalidatePath('/');
        revalidatePath('/admin');
        revalidatePath('/admin/ads');

        return { success: true, data: data as Ad };
    } catch (error) {
        console.error('Toggle status error:', error);
        return { success: false, error: 'Error al cambiar estado' };
    }
}

/**
 * Upload image to Supabase Storage
 */
export async function uploadAdImage(formData: FormData): Promise<ActionResult<string>> {
    try {
        const supabase = await createServerSupabaseClient();

        // Check authentication
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            return { success: false, error: 'No autorizado' };
        }

        const file = formData.get('file') as File;
        if (!file) {
            return { success: false, error: 'No se recibió archivo' };
        }

        // Validate file size (max 3MB)
        if (file.size > 3 * 1024 * 1024) {
            return { success: false, error: 'La imagen no puede exceder 3MB' };
        }

        // Validate file type
        if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
            return { success: false, error: 'Formato no válido. Usa JPG, PNG o WebP' };
        }

        // Generate unique filename
        const ext = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${ext}`;

        // Upload to Supabase Storage
        const { data, error } = await supabase.storage
            .from('ads-images')
            .upload(fileName, file, {
                contentType: file.type,
                upsert: false,
            });

        if (error) {
            console.error('Error uploading image:', error);

            // Detectar error de permisos/RLS
            const err = error as any;
            if (err.statusCode === '403' || err.message.includes('row-level security policy')) {
                return {
                    success: false,
                    error: 'Error de permisos: No se ejecutó el script de configuración de Storage en Supabase.'
                };
            }

            return { success: false, error: `Error técnico: ${error.message}` };
        }

        // Get public URL
        const { data: urlData } = supabase.storage
            .from('ads-images')
            .getPublicUrl(data.path);

        return { success: true, data: urlData.publicUrl };
    } catch (error) {
        console.error('Upload error:', error);
        return { success: false, error: 'Error al subir imagen' };
    }
}

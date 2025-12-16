'use server';

import { createPublicSupabaseClient } from '@/lib/supabase/server';

export type EventType = 'view_detail' | 'click_whatsapp' | 'click_website' | 'click_map';

/**
 * Track an analytics event
 * Fire and forget style - we don't want to block UI
 */
export async function trackEvent(adId: string, eventType: EventType) {
    try {
        const supabase = createPublicSupabaseClient();

        // No esperamos el await para no bloquear, pero en Server Actions
        // Next.js espera a que termine. Es rápido de todos modos.
        await supabase.from('analytics_events').insert({
            ad_id: adId,
            event_type: eventType,
        });
    } catch (error) {
        // Silently fail to not disrupt user experience
        console.error('Error tracking event:', error);
    }
}

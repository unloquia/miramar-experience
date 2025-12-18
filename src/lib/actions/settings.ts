'use server';

import { createServerSupabaseClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export interface SystemSetting {
    key: string;
    value: string;
    description: string;
}

export async function getSystemSetting(key: string): Promise<string | null> {
    const supabase = await createServerSupabaseClient();

    // Auth Check
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) return null;

    const { data, error } = await (supabase
        .from('system_settings') as any)
        .select('value')
        .eq('key', key)
        .single();

    if (error) return null;
    return data.value;
}

import { syncToGoogleSheet } from '@/lib/google-sheets';

export async function updateSystemSetting(key: string, value: string) {
    const supabase = await createServerSupabaseClient();

    // Auth Check
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) throw new Error('Unauthorized');

    const { error } = await (supabase
        .from('system_settings') as any)
        .upsert({ key, value });

    if (error) throw new Error(error.message);

    revalidatePath('/admin/settings/integrations');
    return { success: true };
}

export async function syncGoogleSheetAction() {
    const supabase = await createServerSupabaseClient();

    // Auth Check
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Unauthorized');

    // 1. Get Sheet ID
    const { data: setting } = await (supabase
        .from('system_settings') as any)
        .select('value')
        .eq('key', 'google_sheet_id')
        .single();

    const sheetId = setting?.value;
    if (!sheetId) throw new Error('Google Sheet ID no configurado en ajustes.');

    // 2. Get Data from AI View
    const { data: ads, error: adsError } = await supabase
        .from('ai_knowledge_base')
        .select('*');

    if (adsError) throw new Error(`Error leyendo DB: ${adsError.message}`);

    // 3. Sync
    try {
        await syncToGoogleSheet(ads, { spreadsheetId: sheetId, sheetName: 'BotData' });
        return { success: true, count: ads.length };
    } catch (error: any) {
        console.error('Sync Action Error:', error);
        throw new Error(`Error de Sync: ${error.message}`);
    }
}

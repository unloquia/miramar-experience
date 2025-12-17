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

    const { data, error } = await supabase
        .from('system_settings')
        .select('value')
        .eq('key', key)
        .single();

    if (error) return null;
    return data.value;
}

export async function updateSystemSetting(key: string, value: string) {
    const supabase = await createServerSupabaseClient();

    // Auth Check
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) throw new Error('Unauthorized');

    const { error } = await supabase
        .from('system_settings')
        .upsert({ key, value });

    if (error) throw new Error(error.message);

    revalidatePath('/admin/settings/integrations');
    return { success: true };
}

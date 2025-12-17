import { NextRequest, NextResponse } from 'next/server';
import { createPublicSupabaseClient } from '@/lib/supabase/server';
import { syncToGoogleSheet } from '@/lib/google-sheets';

// Force dynamic execution (always fresh data)
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
    try {
        // 1. Security Check (Cron or Admin)
        const authHeader = request.headers.get('authorization');
        const cronSecret = process.env.CRON_SECRET;

        // Simple Bearer token check for Cron jobs
        // Example header: "Authorization: Bearer my-secret-cron-key"
        const isCronAuthorized = cronSecret && authHeader === `Bearer ${cronSecret}`;

        // TODO: Add Admin Session check here if triggered from UI
        // For now we rely on the CRON_SECRET being set

        if (process.env.NODE_ENV === 'production' && !isCronAuthorized) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // 2. Fetch Data from View
        const supabase = createPublicSupabaseClient();

        // Consultamos la vista que creamos
        const { data, error } = await supabase
            .from('ai_knowledge_base')
            .select('*');

        if (error) {
            console.error('Database Error:', error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        // 3. Sync to Google Sheets
        // Try getting ID from DB first, then Env
        let sheetId = process.env.GOOGLE_SHEET_ID;

        try {
            // We use a separate query or client if needed, but here we reuse 'supabase'
            // However, 'supabase' is public/anon client. System settings might need elevated privileges if RLS is strict.
            // For the API route (server-side), we can use the env vars credentials if we had a service_role client.
            // But since we are using createPublicSupabaseClient, let's assume we read from public config OR 
            // relying on ENV is safer for CRON.

            // To make it dynamic from Admin Panel without Service Role, we need to allow 'anon' to read system_settings 
            // OR use a service role client here.
            // For simplicity and security, let's fetch it if possible, otherwise ENV.

            const { data: setting } = await supabase
                .from('system_settings')
                .select('value')
                .eq('key', 'google_sheet_id')
                .single();

            if (setting?.value) {
                sheetId = setting.value;
            }
        } catch (e) {
            console.warn('Could not fetch dynamic sheet ID, using env');
        }

        if (!sheetId) {
            return NextResponse.json({ error: 'GOOGLE_SHEET_ID not configured in DB or ENV' }, { status: 500 });
        }

        await syncToGoogleSheet(data, {
            spreadsheetId: sheetId,
            sheetName: 'BotData' // Nombre de la hoja/pestaña
        });

        return NextResponse.json({
            success: true,
            count: data.length,
            message: 'Synced successfully to Google Sheets'
        });

    } catch (error: any) {
        console.error('Sync Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

import { google } from 'googleapis';
import { JWT } from 'google-auth-library';

// Interfaces for configuration
interface SheetConfig {
    spreadsheetId: string;
    sheetName?: string; // Defualt: 'Sheet1'
}

interface GoogleCredentials {
    client_email?: string;
    private_key?: string;
}

/**
 * Helper to clean and format Private Key
 * Handles \\n literals (from JSON), redundant quotes, and ensures PEM format.
 */
function formatPrivateKey(key: string | undefined): string | undefined {
    if (!key) return undefined;

    // 1. Replace literal "\n" characters with real newlines
    let formatted = key.replace(/\\n/g, '\n');

    // 2. Remove surrounding double quotes if user pasted JSON string value literally
    if (formatted.startsWith('"') && formatted.endsWith('"')) {
        formatted = formatted.slice(1, -1);
    }

    return formatted;
}

/**
 * Initialize Google Auth Client
 */
function getAuthClient(credentials?: GoogleCredentials) {
    // 1. Try explicit credentials (cleaned)
    let email = credentials?.client_email;
    let privateKey = formatPrivateKey(credentials?.private_key);

    // 2. Fallback to Env Vars (cleaned)
    if (!email) {
        email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL || 'miramar-sync-bot@miramar-bot-sync.iam.gserviceaccount.com';
    }
    if (!privateKey) {
        privateKey = formatPrivateKey(process.env.GOOGLE_PRIVATE_KEY);
    }

    // Debug Log (Masked)
    console.log('🤖 Auth Check:', {
        hasEmail: !!email,
        hasKey: !!privateKey,
        keyStart: privateKey?.substring(0, 10),
        isPem: privateKey?.includes('-----BEGIN PRIVATE KEY-----')
    });

    if (!email || !privateKey) {
        throw new Error(`Missing Google Credentials. EmailSet: ${!!email}, KeySet: ${!!privateKey}`);
    }

    return new JWT({
        email,
        key: privateKey,
        scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });
}

/**
 * Syncs an array of objects to a Google Sheet.
 * It CLEARS the sheet content and overwrites it.
 * 
 * @param data Array of row objects (e.g. from database view)
 * @param config Sheet configuration
 */
export async function syncToGoogleSheet(data: Record<string, any>[], config: SheetConfig, credentials?: GoogleCredentials) {
    if (!data || data.length === 0) {
        console.warn('No data to sync to Google Sheets');
        return;
    }

    const auth = getAuthClient(credentials);
    const sheets = google.sheets({ version: 'v4', auth });

    // Extract headers from the first object
    const headers = Object.keys(data[0]);

    // Transform objects to arrays of values (matching header order)
    const rows = data.map(row => headers.map(header => {
        const value = row[header];
        // Convert dates or nulls to string friendly format
        if (value === null || value === undefined) return '';
        if (typeof value === 'object') return JSON.stringify(value);
        return String(value);
    }));

    const sheetName = config.sheetName || 'Sheet1';
    const range = `${sheetName}!A1`;

    try {
        // 1. Clear existing content
        await sheets.spreadsheets.values.clear({
            spreadsheetId: config.spreadsheetId,
            range: sheetName,
        });

        // 2. Write headers + data
        const values = [headers, ...rows];

        await sheets.spreadsheets.values.update({
            spreadsheetId: config.spreadsheetId,
            range: range,
            valueInputOption: 'USER_ENTERED', // Parses numbers, dates, etc.
            requestBody: {
                values,
            },
        });

        console.log(`Successfully synced ${rows.length} rows to Google Sheet`);
        return rows.length;
    } catch (error) {
        console.error('Error syncing to Google Sheet:', error);
        throw error;
    }
}

import { getSystemSetting } from '@/lib/actions/settings';
import { IntegrationForm } from '@/components/admin/IntegrationForm';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function IntegrationsPage() {
    const sheetId = await getSystemSetting('google_sheet_id');
    const serviceEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;

    return (
        <div className="max-w-4xl space-y-6">
            <div>
                <h1 className="text-3xl font-bold">Integraciones</h1>
                <p className="text-muted-foreground">
                    Conecta Miramar Experience con herramientas externas e Inteligencia Artificial.
                </p>
            </div>

            {!serviceEmail && (
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Faltan Credenciales</AlertTitle>
                    <AlertDescription>
                        La variable GOOGLE_SERVICE_ACCOUNT_EMAIL no se detecta. El Bot no podrá leer/escribir hasta que se configure en Vercel (Production).
                    </AlertDescription>
                </Alert>
            )}

            <IntegrationForm
                initialSheetId={sheetId || ''}
                serviceEmail={serviceEmail || 'No configurado (Revisar Env Vars)'}
            />
        </div>
    );
}

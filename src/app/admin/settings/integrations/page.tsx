import { getSystemSetting } from '@/lib/actions/settings';
import { IntegrationForm } from '@/components/admin/IntegrationForm';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

export default async function IntegrationsPage() {
    const sheetId = await getSystemSetting('google_sheet_id');
    const serviceEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;

    if (!serviceEmail) {
        return (
            <div className="max-w-4xl space-y-6">
                <h1 className="text-3xl font-bold">Integraciones</h1>
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error de Configuración del Servidor</AlertTitle>
                    <AlertDescription>
                        No se ha configurado la variable de entorno GOOGLE_SERVICE_ACCOUNT_EMAIL en el servidor.
                        Por favor, contacta al desarrollador para configurar las credenciales de Google Cloud.
                    </AlertDescription>
                </Alert>
            </div>
        );
    }

    return (
        <div className="max-w-4xl space-y-6">
            <div>
                <h1 className="text-3xl font-bold">Integraciones</h1>
                <p className="text-muted-foreground">
                    Conecta Miramar Experience con herramientas externas e Inteligencia Artificial.
                </p>
            </div>

            <IntegrationForm
                initialSheetId={sheetId || ''}
                serviceEmail={serviceEmail}
            />
        </div>
    );
}

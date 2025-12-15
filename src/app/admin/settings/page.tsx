/**
 * Admin Settings Page
 * Placeholder for future settings
 */

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Construction } from 'lucide-react';

export default function SettingsPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold">Configuración</h1>
                <p className="text-muted-foreground">
                    Ajustes del panel de administración
                </p>
            </div>

            <Card>
                <CardHeader className="text-center">
                    <div className="flex justify-center mb-4">
                        <div className="size-16 rounded-full bg-muted flex items-center justify-center">
                            <Construction className="h-8 w-8 text-muted-foreground" />
                        </div>
                    </div>
                    <CardTitle>En construcción</CardTitle>
                    <CardDescription>
                        Esta sección estará disponible próximamente.
                    </CardDescription>
                </CardHeader>
                <CardContent className="text-center text-sm text-muted-foreground">
                    Aquí podrás configurar opciones de la plataforma, gestionar usuarios y más.
                </CardContent>
            </Card>
        </div>
    );
}

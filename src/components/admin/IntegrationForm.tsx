'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { updateSystemSetting, syncGoogleSheetAction } from '@/lib/actions/settings';
import { RefreshCw, Save, FileSpreadsheet, Copy, Bot } from 'lucide-react';
import { Loader2 } from 'lucide-react';

interface IntegrationFormProps {
    initialSheetId: string;
    serviceEmail: string;
}

export function IntegrationForm({ initialSheetId, serviceEmail }: IntegrationFormProps) {
    const [sheetId, setSheetId] = useState(initialSheetId);
    const [isSaving, setIsSaving] = useState(false);
    const [isSyncing, setIsSyncing] = useState(false);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            const res = await updateSystemSetting('google_sheet_id', sheetId);
            if (!res.success) throw new Error(res.error || 'Error al guardar');

            toast.success('Configuración guardada correctamente');
        } catch (error: any) {
            toast.error(error.message || 'Error al guardar configuración');
        } finally {
            setIsSaving(false);
        }
    };

    const handleSync = async () => {
        setIsSyncing(true);
        try {
            // Usamos Server Action para sincronizar con permisos de administrador (session)
            // en lugar de usar endpoint protegido (cron)
            const result = await syncGoogleSheetAction();

            if (!result.success) {
                throw new Error(result.error || 'Fallo desconocido en la sincronización');
            }

            toast.success(`Sincronización exitosa: ${result.count} registros actualizados.`);
        } catch (error: any) {
            console.error(error);
            toast.error(error.message || 'Error al sincronizar');
        } finally {
            setIsSyncing(false);
        }
    };

    const copyEmail = () => {
        navigator.clipboard.writeText(serviceEmail);
        toast.info('Email copiado al portapapeles');
    };

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <FileSpreadsheet className="h-6 w-6 text-green-600" />
                        Google Sheets para Bot IA
                    </CardTitle>
                    <CardDescription>
                        Conecta la base de datos de anuncios con una Hoja de Cálculo para que el Bot pueda leerla.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">

                    {/* Instrucciones */}
                    <div className="bg-muted/50 p-4 rounded-lg space-y-3 text-sm">
                        <p className="font-medium">Cómo configurar:</p>
                        <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
                            <li>Crea una nueva Google Sheet (o usa una existente).</li>
                            <li>
                                Comparte la hoja (Botón "Share") con este email:
                                <div className="mt-1 flex items-center gap-2 bg-background p-2 rounded border">
                                    <code className="flex-1 truncate">{serviceEmail}</code>
                                    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={copyEmail}>
                                        <Copy className="h-3 w-3" />
                                    </Button>
                                </div>
                            </li>
                            <li>Copia el ID de la hoja desde la URL (la cadena larga entre /d/ y /edit).</li>
                            <li>Pégalo abajo y guarda.</li>
                        </ol>
                    </div>

                    <form onSubmit={handleSave} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="sheetId">Google Sheet ID</Label>
                            <Input
                                id="sheetId"
                                placeholder="1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms"
                                value={sheetId}
                                onChange={(e) => setSheetId(e.target.value)}
                            />
                        </div>
                        <div className="flex gap-3">
                            <Button type="submit" disabled={isSaving}>
                                {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                                Guardar ID
                            </Button>

                            <Button type="button" variant="secondary" onClick={handleSync} disabled={isSyncing || !sheetId}>
                                {isSyncing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <RefreshCw className="mr-2 h-4 w-4" />}
                                Forzar Sincronización
                            </Button>
                        </div>
                    </form>

                    {/* Información Estructural para el Usuario */}
                    <div className="pt-6 border-t border-border">
                        <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                            <Bot className="h-5 w-5 text-blue-600" />
                            Información para el Chatbot
                        </h3>
                        <p className="text-sm text-muted-foreground mb-4">
                            Al sincronizar, el sistema generará automáticamente las siguientes columnas en tu hoja.
                            <strong>No hace falta que las crees manualmente.</strong>
                        </p>

                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded border text-sm">
                                <strong className="block mb-1 text-primary">DOMAIN & SUB_TYPE</strong>
                                Sirve para filtrar entre categorías (Gastronomía, Alojamiento, etc.) antes de buscar.
                            </div>
                            <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded border text-sm">
                                <strong className="block mb-1 text-primary">AI_CONTEXT</strong>
                                Un resumen redactado automáticamente para que la IA entienda de qué trata el lugar, dónde está y qué ofrece.
                            </div>
                            <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded border text-sm">
                                <strong className="block mb-1 text-primary">WEIGHT (1-100)</strong>
                                <span className="text-amber-600 font-medium">¡Importante!</span> Indica la prioridad comercial.
                                La IA debería priorizar recomendar lugares con peso alto (Hero/Featured).
                            </div>
                            <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded border text-sm">
                                <strong className="block mb-1 text-primary">METADATA_JSON</strong>
                                Datos técnicos extra (precios, horarios, si tiene pileta, etc.) en formato crudo para consultas avanzadas.
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
